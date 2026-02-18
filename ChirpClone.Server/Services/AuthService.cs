using ChirpClone.Server.Data;
using ChirpClone.Server.Domain.Entities;
using ChirpClone.Server.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace ChirpClone.Server.Services;

public class AuthService
{
    private readonly ChirpDbContext _db;
    private readonly PasswordHasher _hasher;
    private readonly JwtTokenService _jwt;
    private readonly IConfiguration _cfg;

    public AuthService(ChirpDbContext db, PasswordHasher hasher, JwtTokenService jwt, IConfiguration cfg)
    {
        _db = db; _hasher = hasher; _jwt = jwt; _cfg = cfg;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest req)
    {
        var handle = req.Handle.Trim().TrimStart('@');
        if (handle.Length < 3) throw new InvalidOperationException("Handle is too short.");
        if (req.Password.Length < 8) throw new InvalidOperationException("Password must be at least 8 characters.");

        var email = req.Email.Trim().ToLowerInvariant();
        var exists = await _db.Users.AnyAsync(u => u.Email == email || u.Handle == handle);
        if (exists) throw new InvalidOperationException("Email or handle already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Handle = handle,
            DisplayName = req.DisplayName.Trim(),
            Email = email,
            PasswordHash = _hasher.Hash(req.Password),
            CreatedAtUtc = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var access = _jwt.CreateAccessToken(user);
        return new AuthResponse(access, user.Id, user.Handle, user.DisplayName);
    }

    public async Task<(AuthResponse auth, string refreshToken)> LoginAsync(LoginRequest req)
    {
        var key = req.EmailOrHandle.Trim().TrimStart('@').ToLowerInvariant();

        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.Email == key || u.Handle.ToLower() == key);

        if (user is null || !_hasher.Verify(req.Password, user.PasswordHash))
            throw new InvalidOperationException("Invalid credentials.");

        var refresh = GenerateRefreshToken();
        await StoreRefreshTokenAsync(user.Id, refresh);

        var access = _jwt.CreateAccessToken(user);
        return (new AuthResponse(access, user.Id, user.Handle, user.DisplayName), refresh);
    }

    public async Task<(AuthResponse auth, string refreshToken)> RefreshAsync(string refreshToken)
    {
        var hash = HashToken(refreshToken);

        var rt = await _db.RefreshTokens.FirstOrDefaultAsync(x =>
            x.TokenHash == hash && x.RevokedAtUtc == null && x.ExpiresAtUtc > DateTime.UtcNow);

        if (rt is null) throw new InvalidOperationException("Invalid refresh token.");

        rt.RevokedAtUtc = DateTime.UtcNow;

        var user = await _db.Users.FindAsync(rt.UserId)
            ?? throw new InvalidOperationException("User not found.");

        var newRefresh = GenerateRefreshToken();
        await StoreRefreshTokenAsync(user.Id, newRefresh);

        await _db.SaveChangesAsync();

        var access = _jwt.CreateAccessToken(user);
        return (new AuthResponse(access, user.Id, user.Handle, user.DisplayName), newRefresh);
    }

    public async Task LogoutAsync(string refreshToken)
    {
        var hash = HashToken(refreshToken);
        var rt = await _db.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == hash && x.RevokedAtUtc == null);
        if (rt != null)
        {
            rt.RevokedAtUtc = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    private async Task StoreRefreshTokenAsync(Guid userId, string refreshToken)
    {
        var days = int.Parse(_cfg["Jwt:RefreshTokenDays"]!);

        _db.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = HashToken(refreshToken),
            ExpiresAtUtc = DateTime.UtcNow.AddDays(days),
            CreatedAtUtc = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();
    }

    private static string GenerateRefreshToken()
        => Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));

    private static string HashToken(string token)
    {
        using var sha = SHA256.Create();
        return Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(token)));
    }
}
