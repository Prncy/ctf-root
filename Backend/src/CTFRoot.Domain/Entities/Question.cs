using CTFRoot.Domain.Common;
using CTFRoot.Domain.Enums;

namespace CTFRoot.Domain.Entities;

public sealed class Question : Entity
{
    public Guid ModuleId { get; private set; }
    public Module? Module { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public int Points { get; private set; }
    public int SortOrder { get; private set; }
    public AttemptPolicy AttemptPolicy { get; private set; }
    public int? AttemptLimit { get; private set; }
    public decimal DeductionPercentage { get; private set; }
    public bool IsActive { get; private set; } = true;
    public ICollection<QuestionHint> Hints { get; private set; } = new List<QuestionHint>();

    private Question() { }

    public Question(Guid moduleId, string title, string description, int points,
        int sortOrder, AttemptPolicy attemptPolicy, int? attemptLimit, decimal deductionPercentage)
    {
        if (moduleId == Guid.Empty) throw new ArgumentException("A module is required.", nameof(moduleId));
        if (points <= 0) throw new ArgumentOutOfRangeException(nameof(points), "Points must be greater than zero.");
        if (sortOrder < 0) throw new ArgumentOutOfRangeException(nameof(sortOrder));
        ValidateAttemptSettings(attemptPolicy, attemptLimit, deductionPercentage);

        ModuleId = moduleId;
        Title = Require(title, nameof(title));
        Description = description?.Trim() ?? string.Empty;
        Points = points;
        SortOrder = sortOrder;
        AttemptPolicy = attemptPolicy;
        AttemptLimit = attemptLimit;
        DeductionPercentage = deductionPercentage;
    }

    public void UpdateAttemptSettings(AttemptPolicy policy, int? limit, decimal deductionPercentage)
    {
        ValidateAttemptSettings(policy, limit, deductionPercentage);
        AttemptPolicy = policy;
        AttemptLimit = limit;
        DeductionPercentage = deductionPercentage;
        MarkUpdated();
    }

    private static void ValidateAttemptSettings(AttemptPolicy policy, int? limit, decimal deduction)
    {
        if (policy == AttemptPolicy.Unlimited && (limit is not null || deduction != 0))
            throw new ArgumentException("Unlimited attempts cannot have a limit or deduction.");
        if (policy == AttemptPolicy.LimitedLock && (limit is null or <= 0 || deduction != 0))
            throw new ArgumentException("Limited lock requires a positive limit and no deduction.");
        if (policy == AttemptPolicy.LimitedDeduction &&
            (limit is null or <= 0 || deduction is < 0 or > 100))
            throw new ArgumentException("Limited deduction requires a positive limit and a deduction from 0 to 100.");
    }

    private static string Require(string value, string name) =>
        string.IsNullOrWhiteSpace(value)
            ? throw new ArgumentException("A value is required.", name)
            : value.Trim();
}
