using System.Security.Claims;

namespace ChirpClone.Server.Services;

public class CurrentUserAccessor
{
    private readonly IHttpContextAccessor _http;
    public CurrentUserAccessor(IHttpContextAccessor http) => _http = http;

    public Guid UserId
    {
        get
        {
            var sub = _http.HttpContext?.User.FindFirstValue("sub");
            if (sub is null) throw new InvalidOperationException("Not authenticated.");
            return Guid.Parse(sub);
        }
    }
}
