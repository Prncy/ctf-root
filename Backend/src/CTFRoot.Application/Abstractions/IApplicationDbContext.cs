using CTFRoot.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CTFRoot.Application.Abstractions;

public interface IApplicationDbContext
{
    DbSet<Challenge> Challenges { get; }
    DbSet<LearningPath> LearningPaths { get; }
    DbSet<Module> Modules { get; }
    DbSet<Question> Questions { get; }
    DbSet<QuestionHint> QuestionHints { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
