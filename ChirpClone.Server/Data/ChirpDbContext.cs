using ChirpClone.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChirpClone.Server.Data;

public class ChirpDbContext : DbContext
{
    public ChirpDbContext(DbContextOptions<ChirpDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Poll> Polls => Set<Poll>();
    public DbSet<PollOption> PollOptions => Set<PollOption>();
    public DbSet<Follow> Follows => Set<Follow>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        b.Entity<Follow>().HasKey(x => new { x.FollowerId, x.FolloweeId });

        b.Entity<User>().HasIndex(x => x.Handle).IsUnique();
        b.Entity<User>().HasIndex(x => x.Email).IsUnique();

        b.Entity<Post>().HasIndex(x => x.CreatedAtUtc);

        b.Entity<Notification>()
            .HasIndex(x => new { x.UserId, x.CreatedAtUtc });

        b.Entity<Poll>()
            .HasOne(p => p.Post)
            .WithOne(p => p.Poll)
            .HasForeignKey<Poll>(p => p.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<PollOption>()
            .HasOne(o => o.Poll)
            .WithMany(p => p.Options)
            .HasForeignKey(o => o.PollId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<RefreshToken>()
            .HasOne(rt => rt.User)
            .WithMany()
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<RefreshToken>()
            .HasIndex(rt => rt.TokenHash)
            .IsUnique();

    }
}
