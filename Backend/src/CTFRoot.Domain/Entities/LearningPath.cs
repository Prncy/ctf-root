using CTFRoot.Domain.Common;
using CTFRoot.Domain.Enums;

namespace CTFRoot.Domain.Entities;

public sealed class LearningPath : Entity
{
    public string CreatorUserId { get; private set; } = string.Empty;
    public string Title { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public Difficulty Difficulty { get; private set; }
    public PriceTier PriceTier { get; private set; }
    public ContentStatus Status { get; private set; } = ContentStatus.Draft;
    public bool IsVisible { get; private set; } = true;
    public ICollection<Module> Modules { get; private set; } = new List<Module>();

    private LearningPath() { }

    public LearningPath(string creatorUserId, string title, string slug,
        string description, string category, Difficulty difficulty, PriceTier priceTier)
    {
        CreatorUserId = Require(creatorUserId, nameof(creatorUserId));
        Title = Require(title, nameof(title));
        Slug = Require(slug, nameof(slug));
        Description = Require(description, nameof(description));
        Category = Require(category, nameof(category));
        Difficulty = difficulty;
        PriceTier = priceTier;
    }

    public void ChangeStatus(ContentStatus status)
    {
        Status = status;
        MarkUpdated();
    }

    private static string Require(string value, string name) =>
        string.IsNullOrWhiteSpace(value)
            ? throw new ArgumentException("A value is required.", name)
            : value.Trim();
}
