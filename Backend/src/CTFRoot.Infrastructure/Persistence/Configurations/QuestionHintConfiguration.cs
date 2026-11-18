using CTFRoot.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CTFRoot.Infrastructure.Persistence.Configurations;

public sealed class QuestionHintConfiguration : IEntityTypeConfiguration<QuestionHint>
{
    public void Configure(EntityTypeBuilder<QuestionHint> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Text).HasMaxLength(2000).IsRequired();
        builder.HasIndex(x => new { x.QuestionId, x.SortOrder }).IsUnique();
    }
}
