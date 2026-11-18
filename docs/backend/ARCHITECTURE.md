# CTF Root — Backend Architecture & Implementation Plan

**Status:** Proposed architecture; implementation not started  
**Last updated:** 18 November 2026

This document adapts the supplied backend architecture reference to CTF Root's actual player, creator and admin workflows. It is a technical plan, not a claim that these backend services already exist.

## 1. Product scope and principles

CTF Root has three role experiences:

- **Player:** discover and solve challenges, follow learning paths, join events, track progress and compete.
- **Creator:** create and manage owned challenges and learning paths; submit event content for review when required.
- **Admin:** manage users, permissions, events, creator assignments, moderation, announcements and platform configuration.

The backend must enforce every important rule. The browser must never be trusted to decide permissions, correct flags, scores, attempt counts, premium access or review outcomes.

### Confirmed technical direction

| Area | Decision |
|---|---|
| Backend | C# with ASP.NET Core Web API |
| Database | Microsoft SQL Server |
| Data access | Entity Framework Core |
| Local development | SQL Server Express or another supported local SQL Server instance |
| Architecture | API, Application, Domain and Infrastructure layers |
| Tests | xUnit |
| Initial deployment | One stateless API instance |
| Future scale | Support multiple API instances behind a load balancer |
| Frontend | Existing React + Vite application |
| Styling | Existing plain CSS approach |

The exact .NET SDK, SQL Server hosting provider, deployment region and domain arrangement will be selected during environment setup. Do not assume a provider offers Zambia-based data residency until its region and terms have been verified.

### Guiding principles

1. Security and authorization belong on the server.
2. Domain rules should not depend on ASP.NET Core, EF Core or a database provider.
3. Never expose secrets in player-facing responses.
4. Use transactions for submissions, attempt counters and score changes.
5. Build the smallest useful version first; add distributed infrastructure only when justified.
6. Keep API contracts explicit and versionable.
7. Make important actions auditable.
8. Preserve event history and competition records when events are unpublished.

## 2. Proposed solution structure

    Backend/
    ├── CTFRoot.sln
    ├── src/
    │   ├── CTFRoot.Api/
    │   │   ├── Controllers/
    │   │   ├── Hubs/                 # Later phase
    │   │   ├── Middleware/
    │   │   ├── Authorization/
    │   │   ├── HostedServices/
    │   │   ├── Extensions/
    │   │   ├── Configuration/
    │   │   └── Program.cs
    │   ├── CTFRoot.Application/
    │   │   ├── Abstractions/
    │   │   ├── DTOs/
    │   │   ├── Features/
    │   │   ├── Validators/
    │   │   ├── Mapping/
    │   │   └── Common/
    │   ├── CTFRoot.Domain/
    │   │   ├── Entities/
    │   │   ├── Enums/
    │   │   ├── ValueObjects/
    │   │   └── Exceptions/
    │   └── CTFRoot.Infrastructure/
    │       ├── Identity/
    │       ├── Persistence/
    │       │   ├── Configurations/
    │       │   └── Migrations/
    │       ├── Security/
    │       ├── Email/
    │       ├── Storage/
    │       └── Services/
    └── tests/
        ├── CTFRoot.UnitTests/
        └── CTFRoot.IntegrationTests/

### Dependency direction

- Domain has no project dependencies.
- Application references Domain.
- Infrastructure references Application and Domain.
- Api references Application and Infrastructure.
- Tests reference the projects they test.

Controllers should remain thin. Business rules belong in application use cases and domain logic, not controllers.

## 3. Domain model and database design

This is the proposed logical model. Exact SQL types, indexes, constraints and delete behavior will be finalized in EF Core configurations and migrations.

### 3.1 Identity, roles and permissions

| Entity | Purpose / important fields |
|---|---|
| User | Identity user, username, email, display name, avatar, biography, status, created date |
| Role | Player, Creator, Admin and future roles |
| UserRole | Many-to-many user/role assignment |
| Permission | Granular permission key and description |
| RolePermission | Permissions granted to a role |
| RefreshToken | Hashed token, user, token family, expiry, revoked date and replacement reference |
| UserSession | Optional device/session metadata and revocation state |
| EmailVerification | Verification token/code hash, expiry and used date |
| PasswordReset | Reset verifier, expiry, failed attempts and used date |

A user may have multiple roles. Sensitive admin operations should use explicit policies such as Events.Manage, Users.Suspend and Content.Review. Public registration creates a Player account only. Creator and Admin privileges are granted through authorized workflows, never from a role value supplied by the browser.

### 3.2 Challenges and learning paths

| Entity | Purpose / important fields |
|---|---|
| Challenge | Creator, title, slug, description, category, difficulty, visibility, price tier and status |
| LearningPath | Creator, title, slug, description, category, difficulty, visibility and status |
| Module | Parent challenge or learning path, title, description and display order |
| Question | Module, title, task, points, display order, attempt policy, attempt limit, deduction percentage and active state |
| QuestionHint | Question, hint text and display order |
| QuestionSecret | Protected flag verifier or secret material; never included in player DTOs |
| ContentTag | Creator-defined tag |
| ChallengeTag | Challenge/tag relationship |
| LearningPathTag | Learning-path/tag relationship |
| ContentFile | Content owner, storage key, original filename, media type, size and upload state |

Challenges and learning paths have similar nested structures, but retain separate parent records and lifecycle rules initially. Avoid a generic abstraction until it demonstrably reduces complexity.

Modules are optional. The current editor model places questions inside modules; keep that consistent in the first schema. A module has no independent point value. Parent totals are calculated from question point values and cannot be independently edited.

Difficulty is Easy, Medium or Hard. Price tier is Free or Premium. Tags are creator-defined and separate from platform categories. A Premium badge is informational only; actual access is enforced by the API.

### 3.3 Attempts, submissions and scoring

| Entity | Purpose / important fields |
|---|---|
| QuestionAttempt | User/team, question, attempt number, submitted time, result and awarded points |
| FlagSubmission | Question, submitter, submitted-flag fingerprint, result and timestamp; do not store raw secrets |
| QuestionProgress | User/team, question, state, attempts used, locked date and solved date |
| ContentProgress | User, challenge or learning path, state, completion percentage and last activity |
| ScoreLedgerEntry | User/team, score type, source, points delta, reason and timestamp |

Use a score ledger as the source of truth for awards. Cached totals and leaderboard rows may be maintained for fast reads, but must be rebuildable from ledger entries.

Score types:
- **CP (Challenge Points):** earned from challenge and learning-path questions.
- **EP (Event Points):** earned in event competition.
- A separate **LP** score is not defined yet. Do not invent it until the product rules are agreed.

### 3.4 Events and teams

| Entity | Purpose / important fields |
|---|---|
| Event | Name, description, type, status, registration window, start/end, visibility and owner |
| EventRound | Event, title, order, start/end and status |
| EventCreatorAssignment | Event, creator, assigned by, assigned date and status |
| EventChallenge | Event/round, challenge, review state, reviewer and feedback |
| EventRegistration | Event, user or team, registration date and status |
| Team | Name, captain, join-code/QR-token hash and created date |
| TeamMember | Team, user, role and joined/left dates |
| EventSubmission | Event challenge/question, user or team, submitted time and result |
| EventAnnouncement | Event, author, message and published date |
| Notification | Recipient, type, title, body, read date and related resource |

An event defines whether it is individual or team-based. Individual events accept player registrations; team events accept team registrations and validate membership at submission time.

Team join codes must be unpredictable, protected against brute force and revocable. A QR code is only a convenient representation of a join token; it is not proof of membership by itself.

### 3.5 Review, moderation, audit and subscriptions

| Entity | Purpose / important fields |
|---|---|
| ContentReview | Submitted content, submitter, reviewer, state, feedback and timestamps |
| ModerationAction | Target user/content, action, reason, moderator and timestamp |
| AuditLog | Actor, action, target type/id, timestamp, correlation id and safe metadata |
| SubscriptionPlan | Plan name, entitlement definitions and active state |
| UserSubscription | User, plan, status, start/end dates and provider reference |
| PaymentRecord | Provider reference, amount/currency, state and verified timestamps |

Payment integration is a later phase. A browser redirect or client-supplied payment status is never proof of payment. Entitlements must be granted only after a verified server-to-server provider notification and reconciliation.

## 4. Critical business rules

### 4.1 Question attempt policies

Each question owns its policy and attempt limit:

1. **Unlimited:** no attempt cap; a correct submission awards the question's available points.
2. **Limited + lock:** after the configured number of incorrect attempts, lock that question for that player/team in the relevant context.
3. **Limited + deduction:** after the limit is exhausted, a correct answer earns a reduced award.

Proposed deduction formula:

    awarded points = question points × (1 - deduction percentage / 100)

The deduction is applied once to the question award, not repeatedly to an existing score. Confirm this interpretation before implementation. Attempt count, lock state and awarded points are server-owned; refreshing or changing devices cannot reset attempts.

### 4.2 Flag verification and secret handling

- Never return correct flags/answers in player-facing challenge, learning-path or event responses.
- Verify flags on the server using constant-time comparison.
- Normalize only agreed safe aspects, such as surrounding whitespace. Do not silently change case unless flags are explicitly defined as case-insensitive.
- Do not store plaintext flags in ordinary question rows or logs. Store a keyed HMAC verifier or protect the secret using authenticated encryption with keys held outside the database.
- If creators need to edit a flag, use a protected write-only update flow; do not expose secrets through general content read endpoints.
- Never log raw submitted flags or secret values.

### 4.3 Atomic submission processing

A submission is one server-side use case:

1. Authenticate the player and resolve permitted user/team context.
2. Confirm content is published, accessible and within any event window.
3. Check premium entitlement where applicable.
4. Load attempt policy and current progress.
5. Enforce lock/limit rules.
6. Verify the flag.
7. Record the attempt and progress change.
8. If correct, create exactly one score-ledger award and update derived totals.
9. Commit the transaction and return a safe result.

Use a database transaction and idempotency strategy so retries or concurrent submissions cannot award points twice.

### 4.4 Creator publishing and event review

- Creators manage only content they own, unless an explicit admin permission allows otherwise.
- Independent content follows the normal publish workflow.
- Event-linked content from an assigned creator enters a review queue.
- Admin reviewers approve or request changes with feedback.
- Players see only approved and published event content.
- Unpublishing an event must not delete registrations, teams, scores, submissions, assignments, rounds or audit history.
- Re-publishing restores visibility according to the event's current schedule and state.

### 4.5 Authorization and data scoping

Every request is authorized on the server, including direct API requests that bypass the frontend.

- Players read public published content and their own progress.
- Creators manage only their own content and permitted submissions.
- Creators cannot alter another creator's content by guessing an ID.
- Event creators manage only content covered by their assignment.
- Admins perform only actions covered by their permissions.
- Team members see team competition data only within the relevant event/team rules.

Use resource-based authorization and scoped queries to prevent insecure direct object references. Hidden buttons, route guards and client-side role state are not security controls.

## 5. Authentication and application security

Use ASP.NET Core Identity for password hashing, account lifecycle and lockout.

Initial policy:
- Public player registration; Creator/Admin roles granted through authorized workflows.
- Email verification before sensitive account actions.
- Generic login and password-reset responses to reduce account enumeration.
- Rate-limit login, registration, password reset, flag submissions, team joins and other abuse-prone endpoints.
- Configure lockout after repeated failed sign-ins and tune thresholds through testing.
- Short-lived access tokens and rotating refresh tokens.
- Store only hashed refresh tokens. Detect reuse and revoke the affected token family/session.
- Revoke sessions after password changes/resets, suspension or relevant security changes.
- Use HTTPS outside local development.
- Keep JWT signing keys, database credentials, email credentials and encryption/HMAC keys in deployment secrets, never in the React bundle or repository.
- Validate inputs server-side and use DTOs rather than binding request bodies directly to EF entities.
- Apply strict CORS rules for the actual frontend origin; CORS is not authentication.
- Use security headers and safe production error responses.

### Browser token storage and hosting constraint

The current frontend is hosted on GitHub Pages, while the API will likely have a different origin. This affects refresh-token security.

Preferred production direction: host the frontend and API under a controlled same-site domain arrangement. Use a Secure, HttpOnly refresh-token cookie with an appropriate SameSite policy and strict origin/CSRF protections. Keep access tokens short-lived and in memory where practical.

If the frontend stays on github.io and the API uses an unrelated domain, cross-site cookie restrictions can make cookie refresh unreliable. Decide the domain and deployment arrangement before implementing browser refresh handling. Do not casually put long-lived refresh tokens in localStorage or sessionStorage as a workaround.

### Password reset

Use short-lived, single-use reset codes/tokens generated and verified on the server. Store only a hash/HMAC verifier, enforce expiry and attempt limits, rate-limit requests and return generic responses. Email delivery must not block local development; use a development mail sink or test code locally, never real secrets in logs.

## 6. API design

Use REST endpoints under a versioned prefix such as /api/v1. This is a first-pass resource map, not a promise that every endpoint belongs in the first release.

| Area | Example endpoints |
|---|---|
| Auth | POST /auth/register, /auth/login, /auth/refresh, /auth/logout, /auth/forgot-password, /auth/reset-password, /auth/verify-email |
| Profile | GET /users/me, PATCH /users/me, GET /users/{username} |
| Discovery | GET /challenges, GET /challenges/{slug}, GET /learning-paths, GET /learning-paths/{slug}, GET /creators/{username} |
| Progress | GET /me/progress, GET /me/bookmarks, POST /content/{id}/bookmark |
| Submissions | POST /questions/{id}/submissions, GET /questions/{id}/progress |
| Creator | GET /creator/dashboard, POST /creator/challenges, PATCH /creator/challenges/{id}, POST /creator/challenges/{id}/submit; equivalent learning-path routes |
| Reviews | GET /admin/reviews, POST /admin/reviews/{id}/approve, POST /admin/reviews/{id}/request-changes |
| Events | GET /events, GET /events/{slug}, POST /events/{id}/register, plus event/round management routes |
| Teams | POST /teams, POST /teams/join, GET /teams/{id}, membership management routes |
| Notifications | GET /me/notifications, PATCH /me/notifications/{id}/read |
| Admin | User, role/permission, event, moderation, audit and plan management routes |

Use pagination for collections, consistent validation errors, stable identifiers, allow-listed filters/sorts and explicit DTOs. Never return correct answers, flag verifiers, private moderation notes, refresh-token hashes or internal audit metadata in ordinary DTOs.

## 7. Frontend integration

The React application should call the API through a centralized client/service layer rather than embedding fetch logic throughout components.

Suggested future structure:

    src/
    ├── api/
    │   ├── client.js
    │   ├── auth.js
    │   ├── challenges.js
    │   ├── learningPaths.js
    │   ├── creator.js
    │   ├── events.js
    │   └── notifications.js
    ├── hooks/
    └── features/

Frontend responsibilities:
- Display loading, empty, success and error states.
- Validate basic form shape for user experience; the API repeats important validation.
- Keep role-based navigation as presentation only.
- Refetch server-owned progress and scores after mutations.
- Never calculate authoritative scores or verify flags locally.
- Never bundle secrets or privileged API keys.
- Replace demo seed data feature by feature only when corresponding endpoints are ready.

A server-state cache such as TanStack Query can be considered if its value justifies the dependency and learning cost. It is not required for the first integration.

## 8. Infrastructure: now versus later

### First backend release

- One ASP.NET Core API instance.
- SQL Server and EF Core migrations.
- ASP.NET Core Identity.
- Server-side authorization and validation.
- Structured logging and safe error handling.
- Health endpoint(s).
- Automated tests for security-critical rules.
- Basic backup and restore procedure.
- Environment-based configuration and secret management.

### Defer until there is a demonstrated need

- Redis cache and distributed rate limiting.
- SignalR real-time notifications/chat.
- Redis SignalR backplane.
- Multiple API instances and load balancer.
- Distributed background-job infrastructure.
- Advanced analytics pipelines.
- Docker-based deployment unless it materially improves the chosen workflow.
- Live challenge labs/containers.
- Payment gateway and automated subscription billing.

A single API instance is fine initially, but do not rely on in-memory state for sessions, authoritative scores or cross-request correctness. Database-backed state preserves the path to scale out.

## 9. Implementation roadmap

### Phase 0 — Requirements and environment

- Review this plan and settle outstanding product rules.
- Select .NET SDK and SQL Server development setup.
- Decide frontend/API domain arrangement before browser token implementation.
- Create solution/projects and safe local configuration workflow.

**Exit condition:** solution builds locally and no credentials are committed.

### Phase 1 — Domain foundation and persistence

- Implement core domain entities.
- Configure EF Core and SQL Server.
- Add initial migration and development seed data.
- Add abstractions only where they add value; avoid unnecessary generic repository layers.
- Add unit and integration test projects.

**Exit condition:** database can be created from migrations and core constraints are tested.

### Phase 2 — Authentication and authorization

- Registration, email verification, login, logout, refresh and password reset.
- Role and permission model.
- Resource ownership checks.
- Rate limits, lockout, session revocation and audit events.

**Exit condition:** tests prove users cannot access another user's protected resources or grant themselves privileged roles.

### Phase 3 — Content authoring and discovery

- Challenge and learning-path CRUD.
- Modules, questions, hints, tags and difficulty.
- Draft, publish and unpublish lifecycle.
- Creator ownership enforcement.
- Public discovery endpoints with safe DTOs.
- File metadata and storage abstraction; enable actual uploads only after storage and scanning decisions.

**Exit condition:** creators manage their own content and players discover only content they are allowed to see.

### Phase 4 — Submissions, attempts and scoring

- Protected flag storage/verification.
- Attempt policy enforcement.
- Atomic submission processing.
- Score ledger and derived totals.
- Progress, bookmarks and leaderboard queries.

**Exit condition:** duplicate/concurrent submissions cannot duplicate awards; flags and scoring secrets never leak through player APIs.

### Phase 5 — Events, teams and review

- Event and round management.
- Creator assignments.
- Event content review and feedback.
- Individual/team registration and membership.
- Event submissions and EP scoring.
- Announcements and notification records.
- Preserve competition history when events are unpublished.

**Exit condition:** event lifecycle and role boundaries are covered by integration tests.

### Phase 6 — Production hardening and frontend integration

- Connect React authentication and API client.
- Replace demo state feature by feature.
- Configure production secrets, HTTPS, CORS and domain strategy.
- Verify backup/restore, monitoring, health checks and deployment rollback.
- Run security and performance tests.
- Prepare privacy, terms and account deletion workflows before public launch.

**Exit condition:** production checklist is completed and critical flows are tested end to end.

Premium payments, real-time SignalR features, Redis caching, multiple API instances and labs should be separate later increments.

## 10. Testing strategy

Prioritize tests around rules that would damage trust if they failed:

- Authentication, refresh-token rotation and session revocation.
- Role/permission checks and creator ownership.
- Event creator assignment scope.
- Premium entitlement enforcement.
- Correct flags never returned to player endpoints.
- Unlimited, lockout and deduction attempt policies.
- Concurrent and duplicate submission handling.
- Exactly-once score awards.
- Team membership and event eligibility.
- Review approval/request-changes workflow.
- Unpublishing events without deleting historical data.
- Account suspension and moderation effects.

Use unit tests for domain/application rules and integration tests against a real SQL Server test database where practical. Mocked repositories alone cannot validate transactions, indexes, constraints or concurrency behavior.

## 11. Operational and release checklist

- [ ] HTTPS and secure deployment configuration.
- [ ] No secrets in source control or frontend assets.
- [ ] Registration, email verification, login, logout and reset tested.
- [ ] Refresh-token rotation, reuse detection and revocation tested.
- [ ] Rate limits and lockout configured.
- [ ] Privileged endpoints enforce server-side authorization.
- [ ] Creator ownership and event assignment scope tested.
- [ ] Correct flags and secret values excluded from player responses and logs.
- [ ] Submission transactions and duplicate protection tested.
- [ ] Database backups and a restore test completed.
- [ ] Migrations run as a controlled deployment step, not automatically by every production API instance.
- [ ] Health checks, structured logs and safe errors configured.
- [ ] File upload limits, allowed types, storage permissions and malware-scanning approach defined before enabling uploads.
- [ ] Privacy policy, terms, data retention and account deletion process prepared.
- [ ] Production domain, CORS and browser token strategy verified.
- [ ] Deployment rollback procedure documented.

## 12. Decisions still requiring confirmation

These are intentionally open rather than guessed:

1. **Production hosting/data location:** verify region availability, data residency, backups, pricing and operational fit before choosing a provider.
2. **Frontend/API domain:** decide whether to move from GitHub Pages to a custom-domain arrangement that supports secure refresh cookies.
3. **Event team scoring:** shared team score, individual contribution tracking and tie-break rules.
4. **Deduction policy:** confirm the proposed formula and when it begins to apply.
5. **Learning-path completion:** whether every question is required or optional questions are allowed.
6. **Premium entitlement:** whether a subscription unlocks all premium content or content can have separate purchase/access rules.
7. **File storage:** provider, region, limits, scanning and retention before enabling uploads.
8. **Account deletion/public profiles:** public profile fields and retention of historical competition records after deletion.

## 13. Reference and current implementation status

This plan adapts the supplied backend architecture reference: layered ASP.NET Core design, Identity/JWT, role and policy authorization, SQL persistence, refresh-token rotation, audit logging, SignalR, caching, scale-out and release hardening.

It intentionally does not implement every production infrastructure component in the first release. CTF Root should begin with a secure, testable single-instance API and a well-designed relational model, then add distributed services when usage and operational needs justify them.

**Current repository status:** the project currently contains the React/Vite frontend and demonstration data. The backend described here is planned work. No production API, SQL database, real authentication, persistent scoring, payment processing or real-time service is implied by this document.
