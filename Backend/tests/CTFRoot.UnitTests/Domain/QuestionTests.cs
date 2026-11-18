using CTFRoot.Domain.Entities;
using CTFRoot.Domain.Enums;
using Xunit;

namespace CTFRoot.UnitTests.Domain;

public sealed class QuestionTests
{
    [Fact]
    public void Constructor_RejectsZeroPoints()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() =>
            new Question(Guid.NewGuid(), "Test", "Description", 0, 0,
                AttemptPolicy.Unlimited, null, 0));
    }

    [Fact]
    public void UnlimitedPolicy_RejectsAttemptLimit()
    {
        Assert.Throws<ArgumentException>(() =>
            new Question(Guid.NewGuid(), "Test", "Description", 10, 0,
                AttemptPolicy.Unlimited, 3, 0));
    }

    [Fact]
    public void LimitedLock_RequiresPositiveAttemptLimit()
    {
        Assert.Throws<ArgumentException>(() =>
            new Question(Guid.NewGuid(), "Test", "Description", 10, 0,
                AttemptPolicy.LimitedLock, null, 0));
    }

    [Fact]
    public void LimitedDeduction_AcceptsValidSettings()
    {
        var question = new Question(Guid.NewGuid(), "Test", "Description", 100, 0,
            AttemptPolicy.LimitedDeduction, 3, 25);

        Assert.Equal(AttemptPolicy.LimitedDeduction, question.AttemptPolicy);
        Assert.Equal(25, question.DeductionPercentage);
    }
}
