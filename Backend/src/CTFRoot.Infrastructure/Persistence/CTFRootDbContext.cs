using CTFRoot.Application.Abstractions;
using CTFRoot.Domain.Entities;
using CTFRoot.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CTFRoot.Infrastructure.Persistence;

public sealed class CTFRootDbContext(DbContextOptions<CTFRootDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole, string>(options), IApplicationDbContext
{
    public DbSet<Challenge> Challenges => Set<Challenge>();
    public DbSet<LearningPath> LearningPaths => Set<LearningPath>();
    public DbSet<Module> Modules => Set<Module>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<QuestionHint> QuestionHints => Set<QuestionHint>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CTFRootDbContext).Assembly);

        modelBuilder.Entity<ApplicationUser>(builder =>
        {
            builder.Property(user => user.DisplayName).HasMaxLength(100).IsRequired();
            builder.Property(user => user.CreatedAt).IsRequired();
        });
    }
}
