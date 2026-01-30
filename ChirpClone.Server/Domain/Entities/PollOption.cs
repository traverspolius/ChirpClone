namespace ChirpClone.Server.Domain.Entities;

public class PollOption
{
    // Primary key
    public Guid Id { get; set; }

    // FK to Poll
    public Guid PollId { get; set; }
    public Poll? Poll { get; set; }

    public string OptionText { get; set; } = default!;

    // Simple counter approach (later you can normalize to PollVotes)
    public int VoteCount { get; set; }
}
