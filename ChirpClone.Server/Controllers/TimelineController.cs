using ChirpClone.Server.Data;
using ChirpClone.Server.Dtos;
using ChirpClone.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChirpClone.Server.Controllers;

[ApiController]
[Route("api/timeline")]
[Authorize]
public class TimelineController : ControllerBase
{
    private readonly ChirpDbContext _db;
    private readonly CurrentUserAccessor _me;

    public TimelineController(ChirpDbContext db, CurrentUserAccessor me)
    {
        _db = db; _me = me;
    }

    [HttpGet("home")]
    public async Task<ActionResult<List<PostDto>>> Home([FromQuery] int take = 35)
    {
        var myId = _me.UserId;

        var followeeIds = _db.Follows
            .Where(f => f.FollowerId == myId)
            .Select(f => f.FolloweeId);

        var posts = await _db.Posts
            .AsNoTracking()
            .Include(p => p.User)
            .Include(p => p.Poll)!.ThenInclude(pl => pl.Options)
            .Where(p => p.UserId == myId || followeeIds.Contains(p.UserId))
            .OrderByDescending(p => p.CreatedAtUtc)
            .Take(Math.Clamp(take, 1, 200))
            .Select(p => new PostDto(
                p.Id,
                p.Content,
                p.CreatedAtUtc,
                new PostAuthorDto(p.User!.Id, p.User!.Handle, p.User!.DisplayName),
                p.Poll == null ? null :
                    new PollDto(p.Poll.Id, p.Poll.ExpiresAtUtc,
                        p.Poll.Options.Select(o => new PollOptionDto(o.Id, o.OptionText, o.VoteCount)).ToList())
            ))
            .ToListAsync();

        return Ok(posts);
    }
}
