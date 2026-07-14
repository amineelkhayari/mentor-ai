using Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
    public DbSet<ApplicationUser> ApplicationUsers { get; set; }
    public DbSet<Categorie> Categories { get; set; }

    public DbSet<Formation> Formations { get; set; }

    public DbSet<Session> Sessions { get; set; }

    public DbSet<UserSession> UserSessions { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserSession>()
            .HasKey(x => new { x.UserId, x.SessionId });

        builder.Entity<UserSession>()
            .HasOne(x => x.User)
            .WithMany(x => x.UserSessions)
            .HasForeignKey(x => x.UserId);

        builder.Entity<UserSession>()
            .HasOne(x => x.Session)
            .WithMany(x => x.UserSessions)
            .HasForeignKey(x => x.SessionId);

        builder.Entity<Formation>()
            .HasOne(x => x.Category)
            .WithMany(x => x.Formations)
            .HasForeignKey(x => x.CategoryId);

        builder.Entity<Session>()
            .HasOne(x => x.Formation)
            .WithMany(x => x.Sessions)
            .HasForeignKey(x => x.FormationId);

        builder.Entity<Session>()
            .HasOne(s => s.Formateur)
            .WithMany(f => f.Sessions)
            .HasForeignKey(s => s.FormateurId);
    }
}
