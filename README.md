# CTF Root

A cybersecurity learning and competition platform.

## Current phase

The project is in its frontend-first phase. The current interface uses local seed data to demonstrate the intended experience. No production authentication, scoring, chat, payments, or hosted vault infrastructure is connected yet.

## Stack

- React
- Vite
- Plain CSS
- Lucide icons

## Run locally

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

## Product areas

- Player dashboard and profiles
- Challenge discovery
- Learning paths and progress
- Individual and team events
- Creator discovery and workspace
- Leaderboards
- Vault interface (demo state)
- Subscription page (Coming Soon)

## Theme

The visual direction uses a dark-first interface with ice-blue and cyan accents, deep navy surfaces, restrained borders and readable typography.

## Backend plan

The backend is planned in C# with ASP.NET Core Web API, SQL Server and Entity Framework Core. The implementation will follow a phased approach, beginning with the core API, persistence, authentication and authorization.

See [Backend Architecture & Implementation Plan](docs/backend/ARCHITECTURE.md) for the proposed domain model, API map, security rules, infrastructure decisions and implementation roadmap.

The backend is not implemented yet. The current frontend still uses demonstration data.
