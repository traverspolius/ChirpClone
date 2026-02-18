namespace ChirpClone.Server.Dtos;

public record RegisterRequest(string Handle, string DisplayName, string Email, string Password);
public record LoginRequest(string EmailOrHandle, string Password);

public record AuthResponse(
    string AccessToken,
    Guid UserId,
    string Handle,
    string DisplayName);
