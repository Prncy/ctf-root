using CTFRoot.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CTFRoot.Infrastructure.Persistence.Configurations;

public sealed class ChallengeConfiguration : IEntityTypeConfiguration<Challenge>
{
    public void Configure(EntityTypeBuilder<Challenge> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CreatorUserId).HasMaxLength(450).IsRequired();
        builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Slug).HasMaxLength(220).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(8000).IsRequired();
        builder.Property(x => x.Category).HasMaxLength(80).IsRequired();
        builder.HasIndex(x => x.Slug).IsUnique();
        builder.HasIndex(x => new { x.CreatorUserId, x.Status });
        builder.HasMany(x => x.Modules).WithOne(x => x.Challenge)
            .HasForeignKey(x => x.ChallengeId).OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class LearningPathConfiguration : IEntityTypeConfiguration<LearningPath>
{
    public void Configure(EntityTypeBuilder<LearningPath> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CreatorUserId).HasMaxLength(450).IsRequired();
        builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Slug).HasMaxLength(220).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(8000).IsRequired();
        builder.Property(x => x.Category).HasMaxLength(80).IsRequired();
        builder.HasIndex(x => x.Slug).IsUnique();
        builder.HasIndex(x => new { x.CreatorUserId, x.Status });
        builder.HasMany(x => x.Modules).WithOne(x => x.LearningPath)
            .HasForeignKey(x => x.LearningPathId).OnDelete(DeleteBehavior.Cascade);
    }
}
