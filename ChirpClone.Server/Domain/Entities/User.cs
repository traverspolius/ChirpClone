namespace ChirpClone.Server.Domain.Entities;

public class User
{
    public Guid Id { get; set; }

    public string Handle { get; set; } = default!;
    public string DisplayName { get; set; } = default!;

    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
