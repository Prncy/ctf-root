namespace CTFRoot.Domain.Enums;

public enum ContentStatus
{
    Draft = 0,
    PendingReview = 1,
    ChangesRequested = 2,
    Published = 3,
    Archived = 4
}

public enum Difficulty
{
    Easy = 0,
    Medium = 1,
    Hard = 2
}

public enum PriceTier
{
    Free = 0,
    Premium = 1
}

public enum AttemptPolicy
{
    Unlimited = 0,
    LimitedLock = 1,
    LimitedDeduction = 2
}
