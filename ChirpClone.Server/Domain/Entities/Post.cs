namespace ChirpClone.Server.Domain.Entities;

public class Post
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public string Content { get; set; } = default!;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }

    // 1:1 poll (optional)
    public Poll? Poll { get; set; }
}
