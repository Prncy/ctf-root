using CTFRoot.Domain.Common;

namespace CTFRoot.Domain.Entities;

public sealed class QuestionHint : Entity
{
    public Guid QuestionId { get; private set; }
    public Question? Question { get; private set; }
    public string Text { get; private set; } = string.Empty;
    public int SortOrder { get; private set; }

    private QuestionHint() { }

    public QuestionHint(Guid questionId, string text, int sortOrder)
    {
        if (questionId == Guid.Empty) throw new ArgumentException("A question is required.", nameof(questionId));
        if (string.IsNullOrWhiteSpace(text)) throw new ArgumentException("Hint text is required.", nameof(text));
        if (sortOrder < 0) throw new ArgumentOutOfRangeException(nameof(sortOrder));
        QuestionId = questionId;
        Text = text.Trim();
        SortOrder = sortOrder;
    }
}
