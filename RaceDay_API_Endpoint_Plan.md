# RaceDay — API Endpoint Plan (Section B)

Roles: **Public** (not logged in) · **Any** (any logged-in user) · **Organiser** · **Participant**

| # | HTTP Method | Route | Description | Role Required | Request Body | Expected Response |
|---|---|---|---|---|---|---|
| 1 | POST | `/api/auth/register` | Registers a new user as either an Organiser or a Participant. | None (public) | `{ fullName, email, password, role }` | 201 Created - new user record (no password). 409 Conflict - email already in use. |
| 2 | POST | `/api/auth/login` | Authenticates a user and returns a JWT access token. | None (public) | `{ email, password }` | 200 OK - `{ token, role, userId }`. 401 Unauthorized - invalid credentials. |
| 3 | GET | `/api/users/me` | Returns the profile of the currently logged-in user. | Any (logged in) | None | 200 OK - user profile. 401 Unauthorized. |
| 4 | PUT | `/api/users/me` | Updates the logged-in user's own profile details. | Any (logged in) | `{ fullName, email }` | 200 OK - updated profile. 400 Bad Request - invalid data. |
| 5 | GET | `/api/events` | Lists all upcoming events, optionally filtered by type or location. | None (public) | None | 200 OK - array of events. |
| 6 | GET | `/api/events/{id}` | Returns full details for a single event, including its categories and route. | None (public) | None | 200 OK - event detail. 404 Not Found. |
| 7 | POST | `/api/events` | Creates a new event. | Organiser | `{ eventName, eventDate, location, eventType, description }` | 201 Created - new event. 400 Bad Request. |
| 8 | PUT | `/api/events/{id}` | Edits an event owned by the logged-in organiser. | Organiser | `{ eventName, eventDate, location, eventType, description }` | 200 OK - updated event. 403 Forbidden - not the owner. 404 Not Found. |
| 9 | DELETE | `/api/events/{id}` | Deletes an event owned by the logged-in organiser. | Organiser | None | 200 OK - confirmation. 403 Forbidden. 404 Not Found. |
| 10 | GET | `/api/events/{id}/categories` | Lists all categories for a specific event. | None (public) | None | 200 OK - array of categories. 404 Not Found. |
| 11 | POST | `/api/events/{id}/categories` | Adds a new category (e.g. 5km, 10km) to an event. | Organiser | `{ categoryName, distanceKm, entryFee, maxParticipants }` | 201 Created - new category. 403 Forbidden - not the owner. |
| 12 | PUT | `/api/categories/{id}` | Edits an existing category. | Organiser | `{ categoryName, distanceKm, entryFee, maxParticipants }` | 200 OK - updated category. 403 Forbidden. 404 Not Found. |
| 13 | DELETE | `/api/categories/{id}` | Removes a category from an event. | Organiser | None | 200 OK - confirmation. 403 Forbidden. 404 Not Found. |
| 14 | POST | `/api/categories/{id}/enrol` | Enrols the logged-in participant into a category. | Participant | `{ }` (participant identified via JWT) | 201 Created - enrolment record. 404 Not Found - category does not exist. 409 Conflict - already enrolled or category full. |
| 15 | GET | `/api/users/me/enrolments` | Lists the logged-in participant's own enrolments. | Participant | None | 200 OK - array of enrolments. |
| 16 | DELETE | `/api/enrolments/{id}` | Cancels the logged-in participant's own enrolment. | Participant | None | 200 OK - confirmation. 403 Forbidden - not the owner. 404 Not Found. |
| 17 | GET | `/api/events/{id}/enrolments` | Lists all enrolments for an event (roster view). | Organiser | None | 200 OK - array of enrolments with participant details. 403 Forbidden - not the owner. |
| 18 | POST | `/api/enrolments/{id}/result` | Captures a race result for a specific enrolment. | Organiser | `{ finishTime, overallPosition, categoryPosition, status }` | 201 Created - result record. 404 Not Found - enrolment does not exist. 409 Conflict - result already captured. |
| 19 | PUT | `/api/results/{id}` | Edits a previously captured result. | Organiser | `{ finishTime, overallPosition, categoryPosition, status }` | 200 OK - updated result. 403 Forbidden. 404 Not Found. |
| 20 | GET | `/api/users/me/results` | Returns the logged-in participant's own results history. | Participant | None | 200 OK - array of results. |
| 21 | GET | `/api/events/{id}/results` | Returns the full results list for an event (leaderboard). | None (public) | None | 200 OK - array of results ranked by position. 404 Not Found. |

**Coverage check against the ERD/schema:**
- Authentication → rows 1–2
- User Profile → rows 3–4
- Events → rows 5–9
- Categories → rows 10–13
- Event Enrolments → rows 14–17
- Results → rows 18–21
