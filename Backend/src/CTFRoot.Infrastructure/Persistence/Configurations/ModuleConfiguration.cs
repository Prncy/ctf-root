using CTFRoot.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CTFRoot.Infrastructure.Persistence.Configurations;

public sealed class ModuleConfiguration : IEntityTypeConfiguration<Module>
{
    public void Configure(EntityTypeBuilder<Module> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title).HasMaxLength(160).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(4000);
        builder.HasIndex(x => new { x.ChallengeId, x.SortOrder });
        builder.HasIndex(x => new { x.LearningPathId, x.SortOrder });
        builder.ToTable(table => table.HasCheckConstraint(
            "CK_Modules_ExactlyOneParent",
            "([ChallengeId] IS NOT NULL AND [LearningPathId] IS NULL) OR ([ChallengeId] IS NULL AND [LearningPathId] IS NOT NULL)"));
        builder.HasMany(x => x.Questions).WithOne(x => x.Module)
            .HasForeignKey(x => x.ModuleId).OnDelete(DeleteBehavior.Cascade);
    }
}
