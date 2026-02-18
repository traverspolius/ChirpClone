using ChirpClone.Server.Data;
using ChirpClone.Server.Domain.Entities;
using ChirpClone.Server.Dtos;
using ChirpClone.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChirpClone.Server.Controllers;

[ApiController]
[Route("api/posts")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly ChirpDbContext _db;
    private readonly CurrentUserAccessor _me;

    public PostsController(ChirpDbContext db, CurrentUserAccessor me)
    {
        _db = db; _me = me;
    }

    [HttpPost]
    public async Task<ActionResult<PostDto>> Create([FromBody] CreatePostRequest req)
    {
        var content = (req.Content ?? "").Trim();
        if (content.Length == 0) return BadRequest("Post content is required.");
        if (content.Length > 280) return BadRequest("Max 280 characters.");

        var post = new Post
        {
            Id = Guid.NewGuid(),
            UserId = _me.UserId,
            Content = content,
            CreatedAtUtc = DateTime.UtcNow
        };

        if (req.Poll != null)
        {
            if (req.Poll.Options.Count < 2 || req.Poll.Options.Count > 4)
                return BadRequest("Poll must have 2-4 options.");

            var duration = Math.Clamp(req.Poll.DurationMinutes, 5, 7 * 24 * 60);

            var poll = new Poll
            {
                Id = Guid.NewGuid(),
                ExpiresAtUtc = DateTime.UtcNow.AddMinutes(duration),
                Options = req.Poll.Options
                    .Select(o => o.Trim())
                    .Where(o => o.Length > 0)
                    .Take(4)
                    .Select(o => new PollOption
                    {
                        Id = Guid.NewGuid(),
                        OptionText = o,
                        VoteCount = 0
                    })
                    .ToList()
            };

            if (poll.Options.Count < 2) return BadRequest("Poll options cannot be empty.");

            post.Poll = poll;
        }

        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        var created = await _db.Posts.AsNoTracking()
            .Include(p => p.User)
            .Include(p => p.Poll)!.ThenInclude(x => x.Options)
            .FirstAsync(p => p.Id == post.Id);

        return Ok(new PostDto(
            created.Id,
            created.Content,
            created.CreatedAtUtc,
            new PostAuthorDto(created.User!.Id, created.User!.Handle, created.User!.DisplayName),
            created.Poll == null ? null :
                new PollDto(created.Poll.Id, created.Poll.ExpiresAtUtc,
                    created.Poll.Options.Select(o => new PollOptionDto(o.Id, o.OptionText, o.VoteCount)).ToList())
        ));
    }
}
