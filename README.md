# RaceDay

RaceDay is a web-based event management system for South African running, walking and cycling events.
Organisers create events, categories and results; Participants browse events, enrol in a category and track their results.

This repository contains:

| Part | What | Where |
|---|---|---|
| 1 | ERD, API endpoint plan, SQL script | `/docs` |
| 2 | ASP.NET Core Web API, EF Core (Code-First), Swagger, unit tests, GitHub Actions CI | `/src/RaceDay.Api`, `/tests/RaceDay.Tests`, `/.github/workflows` |
| 3 | MVC front end | _coming in Part 3_ |

## Tech stack
ASP.NET Core 8 Web API (C#) · Entity Framework Core 8 (Code-First, SQL Server) · Cookie-based session authentication with roles · Swagger (Swashbuckle) · xUnit + `WebApplicationFactory` · GitHub Actions

## Getting started
1. Open `RaceDay.sln` in Visual Studio 2022 (needs the .NET 8 SDK and SQL Server LocalDB / SQL Server Express).
2. Check the connection string in `src/RaceDay.Api/appsettings.json` (`ConnectionStrings:RaceDayDb`). Change the server name if you use a different SQL Server instance from SSMS.
3. Create the database from the code-first model. In **Tools > NuGet Package Manager > Package Manager Console**, set *Default project* to `RaceDay.Api` and run:
   ```
   Add-Migration InitialCreate
   Update-Database
   ```
   (The API also applies migrations automatically when it starts.)
4. Press **F5**. Swagger opens at `/swagger`.

> **Database name:** the connection string points at a database called `RaceDayApiDb` so it does not clash with the `RaceDayDb` you created from the Part 1 script. The tables, columns, keys and constraints are identical. To use `RaceDayDb` instead, change the name in the connection string and drop the Part 1 tables first (EF cannot create tables that already exist).

## Using the API in Swagger
1. `POST /api/auth/register` - create a Participant, e.g. `{ "fullName": "Lindiwe Dube", "email": "lindiwe@example.com", "password": "Passw0rd!", "role": "Participant" }`.
2. `POST /api/auth/register` - create an Organiser. Organisers must supply the invite code (`"organiserCode": "RACEDAY-ORG-2026"`, set in `appsettings.json` under `Registration:OrganiserCode`).
3. `POST /api/auth/login` - Swagger stores the session cookie and sends it with every later request.
4. Try the endpoints. Log out (`POST /api/auth/logout`) and log in as the other role to see role restrictions (403) and unauthenticated access (401).

## Authentication and roles
* **Registration** captures name, email, password and role. Passwords are hashed (ASP.NET Core `PasswordHasher`, PBKDF2 + per-user salt); the original password is never stored or returned.
* **Role management:** letting anyone pick "Organiser" would let any visitor delete events, so Organiser registration requires an invite code. Participants register freely.
* **Session:** logging in signs the user in with an HTTP-only cookie (`RaceDay.Session`) holding their id and role. Every later request is authenticated from that cookie.
* **Authorisation:** `[Authorize(Roles = ...)]` on each endpoint, plus a fallback policy that makes everything protected unless explicitly marked `[AllowAnonymous]`. Organisers can only change events they own. Missing/expired session = 401, wrong role or not the owner = 403.

## Endpoints
The full table (method, route, description, role, request body, responses) is in [`docs/RaceDay_API_Endpoint_Plan.md`](docs/RaceDay_API_Endpoint_Plan.md); Swagger shows the same endpoints live.

## Tests
```
dotnet test
```
Tests start the real API in memory against an in-memory EF Core database and call it over HTTP. They cover:
* **Registration and login** - success, duplicate email, invalid data, organiser invite code, hashed passwords, wrong password, session cookie, logout.
* **Event management** - organisers create / edit / delete their own events and manage categories; other organisers are rejected.
* **Role enforcement** - Participants are rejected from organiser endpoints (403), Organisers from participant endpoints (403), and anonymous users from protected endpoints (401).
* **Enrolments and results** - participants enrol and the link to participant / event / category is recorded, duplicate / full / unknown category cases, cancellation, organiser roster, result capture and participants viewing only their own results.

## Continuous integration
`.github/workflows/ci.yml` restores, builds and runs the tests on every push and pull request to `main`.

## Differences from the Part 1 plan (and why)
| Change | Reason |
|---|---|
| Login sets a session cookie instead of returning a token | Part 2 brief requires session management |
| Added `POST /api/auth/logout` | A session needs a way to end |
| Added `organiserCode` to registration | Stops anyone self-assigning the Organiser role |
| Added `DistanceKm` to **Events**; `Categories.DistanceKm` is now nullable | Part 2 brief: each event captures a distance, and categories can be age-based ("Under 20", "Senior") |
| Extra 409 responses (delete event/category with enrolments, duplicate enrolment, full category) | Protects data integrity |

The Part 1 files in `/docs` (ERD, SQL script, endpoint plan) have been updated to match.

 ![Successful CI build](docs/images/ci-green-build.jpg)