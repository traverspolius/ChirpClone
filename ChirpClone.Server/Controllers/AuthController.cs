using ChirpClone.Server.Dtos;
using ChirpClone.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChirpClone.Server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;
    private readonly IConfiguration _cfg;

    public AuthController(AuthService auth, IConfiguration cfg)
    {
        _auth = auth;
        _cfg = cfg;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest req)
        => Ok(await _auth.RegisterAsync(req));

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req)
    {
        var (auth, refresh) = await _auth.LoginAsync(req);

        var days = int.Parse(_cfg["Jwt:RefreshTokenDays"]!);

        Response.Cookies.Append("chirp_refresh", refresh, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,              // HTTPS (your template uses HTTPS)
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(days)
        });

        return Ok(auth);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> Refresh()
    {
        if (!Request.Cookies.TryGetValue("chirp_refresh", out var refresh))
            return Unauthorized();

        var (auth, newRefresh) = await _auth.RefreshAsync(refresh);

        var days = int.Parse(_cfg["Jwt:RefreshTokenDays"]!);

        Response.Cookies.Append("chirp_refresh", newRefresh, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(days)
        });

        return Ok(auth);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        if (Request.Cookies.TryGetValue("chirp_refresh", out var refresh))
            await _auth.LogoutAsync(refresh);

        Response.Cookies.Delete("chirp_refresh", new CookieOptions
        {
            Secure = true,
            SameSite = SameSiteMode.Lax
        });

        return NoContent();
    }
}
