namespace ChirpClone.Server.Domain.Entities;

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public string Type { get; set; } = default!;
    public string Message { get; set; } = default!;

    public bool IsRead { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}
