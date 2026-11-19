using CTFRoot.Domain.Common;

namespace CTFRoot.Domain.Entities;

public sealed class Module : Entity
{
    public Guid? ChallengeId { get; private set; }
    public Challenge? Challenge { get; private set; }
    public Guid? LearningPathId { get; private set; }
    public LearningPath? LearningPath { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public int SortOrder { get; private set; }
    public ICollection<Question> Questions { get; private set; } = new List<Question>();

    private Module() { }

    public static Module ForChallenge(Guid challengeId, string title, string description, int sortOrder) =>
        new(challengeId, null, title, description, sortOrder);

    public static Module ForLearningPath(Guid learningPathId, string title, string description, int sortOrder) =>
        new(null, learningPathId, title, description, sortOrder);

    private Module(Guid? challengeId, Guid? learningPathId, string title, string description, int sortOrder)
    {
        if ((challengeId is null) == (learningPathId is null))
            throw new ArgumentException("A module must belong to exactly one challenge or learning path.");
        if (sortOrder < 0) throw new ArgumentOutOfRangeException(nameof(sortOrder));
        ChallengeId = challengeId;
        LearningPathId = learningPathId;
        Title = Require(title, nameof(title));
        Description = description?.Trim() ?? string.Empty;
        SortOrder = sortOrder;
    }

    public void AddQuestion(Question question)
    {
        ArgumentNullException.ThrowIfNull(question);
        if (question.ModuleId != Id)
            throw new InvalidOperationException("The question belongs to a different module.");
        Questions.Add(question);
        MarkUpdated();
    }

    private static string Require(string value, string name) =>
        string.IsNullOrWhiteSpace(value)
            ? throw new ArgumentException("A value is required.", name)
            : value.Trim();
}
