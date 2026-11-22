# CTF Root Backend

The backend is a separate ASP.NET Core solution and does not replace or interfere with the React/Vite frontend.

## Requirements

- .NET 10 SDK
- SQL Server Express, Developer Edition, or another supported SQL Server instance for local database-backed API development
- Visual Studio, VS Code with C# tooling, or the .NET CLI

You do **not** need SQL Server or Docker to run the automated tests. The API tests use EF Core's in-memory provider.

## Structure

- `src/CTFRoot.Api`: HTTP entry point and controllers.
- `src/CTFRoot.Application`: use cases and application abstractions.
- `src/CTFRoot.Domain`: framework-independent entities and rules.
- `src/CTFRoot.Infrastructure`: EF Core, SQL Server and external adapters.
- `tests/CTFRoot.UnitTests`: domain unit tests and API authentication tests.

## Build and test

From this directory:

```powershell
dotnet restore CTFRoot.sln
dotnet build CTFRoot.sln --configuration Release --no-restore
dotnet test CTFRoot.sln --configuration Release --no-build
```

The API exposes `/health`. Database and authentication services are registered when a connection string is supplied. Without database configuration, the health endpoint can run, but the authentication endpoints are not available for use. The API uses a configurable CORS allowlist for the deployed GitHub Pages origin and local Vite development.

## Local SQL Server connection

Do not commit credentials. Configure the connection string using .NET user-secrets:

```powershell
cd src/CTFRoot.Api
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:CTFRoot" "Server=localhost;Database=CTFRootDev;Trusted_Connection=True;TrustServerCertificate=True"
dotnet user-secrets set "Jwt:SigningKey" "<a-random-secret-at-least-32-bytes>"
```

Adjust the server name and authentication options to match your SQL Server installation. The JWT issuer and audience can also be overridden with environment variables:

- `Jwt__Issuer`
- `Jwt__Audience`

## Frontend connection

Set `VITE_API_BASE_URL` in the frontend build environment to the deployed API base URL (without a trailing slash). The frontend reads this value at build time. The API CORS allowlist is configured under `Cors:AllowedOrigins`; override it with environment variables such as `Cors__AllowedOrigins__0`. Never put secrets in frontend environment variables.

## Authentication endpoints

- `POST /api/auth/register`: creates an account and assigns only the Player role.
- `POST /api/auth/login`: verifies credentials and returns a short-lived JWT access token.
- `GET /api/auth/me`: returns the authenticated account profile and current roles; send the token as a Bearer token.

Registration and login share an IP-based limit of 10 requests per minute. Identity enforces a five-failure, five-minute account lockout. Login errors use a generic message, and registration does not return detailed Identity errors that could disclose whether an email is already registered.

The automated API tests cover registration, Player role assignment, token use against the protected profile endpoint, successful login, invalid-password handling, unauthenticated profile access, whitespace-only display names, and duplicate-email error disclosure.

## Current scope and security limitations

The first domain slice covers challenges, learning paths, modules, questions and hints. Authentication currently includes local Identity accounts and short-lived JWT access tokens.

This is **not production-ready**. The following are still outstanding:

- Database migrations and verification against SQL Server.
- Email verification and password reset.
- Refresh-token rotation, persistent sessions, logout and revocation.
- Admin-controlled Creator/Admin role provisioning and authorization policies.
- Integration tests against the production database provider.
- Account recovery, operational monitoring, backups and deployment hardening.

Do not commit real secrets or use the test signing key outside automated tests.
