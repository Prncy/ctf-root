namespace CTFRoot.Infrastructure.Identity;

public static class CTFRootRoles
{
    public const string Player = "Player";
    public const string Creator = "Creator";
    public const string Admin = "Admin";

    public static readonly IReadOnlyCollection<string> All =
        [Player, Creator, Admin];
}
