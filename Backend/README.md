# CTF Root Backend

The backend is a separate ASP.NET Core solution and does not replace or interfere with the React/Vite frontend.

## Requirements

- .NET 10 SDK
- SQL Server Express, Developer Edition, or another supported SQL Server instance
- Visual Studio, VS Code with C# tooling, or the .NET CLI

## Structure

- `src/CTFRoot.Api`: HTTP entry point and controllers.
- `src/CTFRoot.Application`: use cases and application abstractions.
- `src/CTFRoot.Domain`: framework-independent entities and rules.
- `src/CTFRoot.Infrastructure`: EF Core, SQL Server and external adapters.
- `tests/CTFRoot.UnitTests`: domain unit tests.

## Build and test

From this directory:

```powershell
dotnet restore CTFRoot.sln
dotnet build CTFRoot.sln --no-restore
dotnet test CTFRoot.sln --no-build
dotnet run --project src/CTFRoot.Api
```

The API exposes `/health`. Database registration is enabled when a connection string is supplied.

## Local SQL Server connection

Do not commit credentials. Configure the connection string using .NET user-secrets:

```powershell
cd src/CTFRoot.Api
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:CTFRoot" "Server=localhost;Database=CTFRootDev;Trusted_Connection=True;TrustServerCertificate=True"
```

Adjust the server name and authentication options to match your SQL Server installation.

## Current scope

The first domain slice covers challenges, learning paths, modules, questions and hints. It does not yet include Identity, flags, submissions, scoring, events, teams, payments or production deployment. Those will be introduced in later milestones with their security and tests.

No database migration has been generated yet. Run EF Core tooling after confirming the local .NET SDK and SQL Server setup.
