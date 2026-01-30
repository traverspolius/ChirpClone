namespace ChirpClone.Server.Domain.Entities;

public class RefreshToken
{
    // Primary key
    public Guid Id { get; set; }

    // FK to User
    public Guid UserId { get; set; }
    public User? User { get; set; }

    // Stored hashed for security
    public string TokenHash { get; set; } = default!;

    public DateTime ExpiresAtUtc { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? RevokedAtUtc { get; set; }

    // Convenience property (not mapped)
    public bool IsActive =>
        RevokedAtUtc == null && ExpiresAtUtc > DateTime.UtcNow;
}
