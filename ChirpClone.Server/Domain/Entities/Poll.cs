namespace ChirpClone.Server.Domain.Entities;

public class Poll
{
    // Primary key (EF Core requires a key)
    public Guid Id { get; set; }

    // 1:1 relationship to Post
    public Guid PostId { get; set; }
    public Post? Post { get; set; }

    public DateTime ExpiresAtUtc { get; set; }

    // Poll options (1-to-many)
    public List<PollOption> Options { get; set; } = new();
}
