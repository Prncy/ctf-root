using CTFRoot.Application.Abstractions;
using CTFRoot.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CTFRoot.Infrastructure.Persistence;

public sealed class CTFRootDbContext(DbContextOptions<CTFRootDbContext> options)
    : DbContext(options), IApplicationDbContext
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
    }
}
