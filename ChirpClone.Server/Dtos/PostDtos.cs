namespace ChirpClone.Server.Dtos;

public record PostAuthorDto(Guid Id, string Handle, string DisplayName);

public record PollOptionDto(Guid Id, string OptionText, int VoteCount);
public record PollDto(Guid Id, DateTime ExpiresAtUtc, List<PollOptionDto> Options);

public record PostDto(
    Guid Id,
    string Content,
    DateTime CreatedAtUtc,
    PostAuthorDto Author,
    PollDto? Poll);

public record CreatePostRequest(string Content, CreatePollRequest? Poll);
public record CreatePollRequest(List<string> Options, int DurationMinutes);
