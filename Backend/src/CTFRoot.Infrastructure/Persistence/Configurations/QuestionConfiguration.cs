using CTFRoot.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CTFRoot.Infrastructure.Persistence.Configurations;

public sealed class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(8000);
        builder.Property(x => x.DeductionPercentage).HasPrecision(5, 2);
        builder.HasIndex(x => new { x.ModuleId, x.SortOrder });
        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_Questions_Points_Positive", "[Points] > 0");
            table.HasCheckConstraint("CK_Questions_SortOrder_NonNegative", "[SortOrder] >= 0");
            table.HasCheckConstraint("CK_Questions_Deduction_Range", "[DeductionPercentage] >= 0 AND [DeductionPercentage] <= 100");
            table.HasCheckConstraint("CK_Questions_AttemptLimit_Positive", "[AttemptLimit] IS NULL OR [AttemptLimit] > 0");
        });
        builder.HasMany(x => x.Hints).WithOne(x => x.Question)
            .HasForeignKey(x => x.QuestionId).OnDelete(DeleteBehavior.Cascade);
    }
}
