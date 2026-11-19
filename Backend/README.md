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

## Authentication configuration

The authentication endpoints are enabled when both a SQL Server connection string and a JWT signing key are configured.

Set these values through environment variables or a secret manager; do not commit real secrets:

- `ConnectionStrings__CTFRoot`: SQL Server connection string.
- `Jwt__SigningKey`: random secret of at least 32 bytes.
- `Jwt__Issuer`: token issuer (defaults to `CTFRoot.Api` in the sample settings).
- `Jwt__Audience`: token audience (defaults to `CTFRoot.Client` in the sample settings).

For local development, use .NET user-secrets rather than appsettings:

```powershell
cd src/CTFRoot.Api
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:CTFRoot" "<your-local-sql-server-connection-string>"
dotnet user-secrets set "Jwt:SigningKey" "<a-random-secret-at-least-32-bytes>"
```

### Authentication endpoints

- `POST /api/auth/register`: creates an account and assigns only the Player role.
- `POST /api/auth/login`: verifies credentials and returns a short-lived JWT access token.
- `GET /api/auth/me`: returns the authenticated account profile and current roles; send the token as a Bearer token.

Registration and login share an IP-based limit of 10 requests per minute. Identity enforces a five-failure, five-minute account lockout. Login errors do not disclose whether an email address exists.

This increment does not yet include email verification, password reset, refresh-token rotation, logout/session revocation, or admin-controlled Creator/Admin provisioning. Do not treat it as production-ready until those controls and database migrations are implemented and tested.
