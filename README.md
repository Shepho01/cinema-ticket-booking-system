# Sheph Cinemas

A full-stack cinema booking application for browsing films, choosing a screening, reserving seats and managing a personal watchlist. The project connects a React interface to an Express API and a PostgreSQL relational database, with Gemini-powered recommendations based on the cinema's movie catalogue.

[Source code](https://github.com/Shepho01/cinema-ticket-booking-system)

## Features

- Browse now-showing and coming-soon movies, with individual movie pages.
- View screening dates, times, screens and ticket prices.
- Select seats using availability calculated for a specific showtime.
- Register and sign in with Argon2id password hashing and JWT authentication in an HTTP-only cookie.
- Create bookings and view booking history in a member profile.
- Add and remove movies from a personal watchlist.
- Request movie recommendations: the backend supplies the currently showing catalogue to Gemini and prompts it to recommend up to three matches.

**Status:** Local development project. Booking creation is implemented; payment-provider integration is not. The payment screen currently contains placeholder provider names.

## Screenshots

### Home page

![Sheph Cinemas home page](docs/screenshots/home-page.png)

### Movies

![Movies page](docs/screenshots/movies-page.png)

### Seat selection

![Seat selection](docs/screenshots/seat-selection.png)

### AI chatbot

![Chatbot](docs/screenshots/chatbot.png)

### Profile orders

![Profile orders](docs/screenshots/profile-orders.png)

### Profile watchlist

![Profile watchlist](docs/screenshots/profile-watchlist.png)

## Technology

| Layer              | Implementation                                        |
| ------------------ | ----------------------------------------------------- |
| Frontend           | React 19, JavaScript/JSX, CSS, React Router, Vite     |
| API                | Node.js, Express 5                                    |
| Database           | PostgreSQL, accessed through the `pg` connection pool |
| Authentication     | Argon2id, JSON Web Tokens, cookie-parser              |
| AI recommendations | Google Gemini via `@google/genai`                     |

## Architecture

```mermaid
flowchart TD
    Browser["React interface"] -->|"HTTP requests and cookies"| API["Express API"]
    API --> Auth["JWT verification and password hashing"]
    API -->|"Parameterized SQL"| DB[("PostgreSQL")]
    API -->|"Movie catalogue and user preference"| Gemini["Gemini API"]
    Gemini -->|"Recommendation text"| API
```

React handles page navigation, authentication state and seat selection. Express validates requests, queries PostgreSQL and calculates booking totals. Gemini is called from the backend so the API key stays outside the browser bundle.

## Relational database

The following ERD is **inferred from the SQL queries in `cinema-backend/routes/`**, rather than exported from a live database. It shows the key relationships and selected fields used by the application. The ZIP does not include SQL migrations or a schema dump, so types, PK/FK markers, cardinalities and nullability are conceptual and must be checked against the actual database definition.

```mermaid
erDiagram
    direction TB
    MEMBERS ||--o{ BOOKINGS : places
    MOVIES ||--o{ SHOWTIMES : has
    SCREENS ||--o{ SHOWTIMES : hosts
    SCREENS ||--o{ SEATS : contains
    SHOWTIMES ||--o{ BOOKINGS : receives
    BOOKINGS ||--o{ BOOKING_SEATS : includes
    SHOWTIMES ||--o{ BOOKING_SEATS : reserves_for
    SEATS ||--o{ BOOKING_SEATS : assigned_to
    MEMBERS ||--o{ WATCHLIST : saves
    MOVIES ||--o{ WATCHLIST : appears_in

    MEMBERS {
        int id PK
        text first_name
        text last_name
        text email
        text password_hash
    }

    MOVIES {
        int id PK
        text name
        text slug
        text classification
        text overview
        text release_status
    }

    SCREENS {
        int id PK
        text name
    }

    SEATS {
        int id PK
        int screen_id FK
        text seat_row
        int seat_number
        text seat_label
    }

    SHOWTIMES {
        int id PK
        int movie_id FK
        int screen_id FK
        timestamp starts_at
        timestamp ends_at
        numeric price
    }

    BOOKINGS {
        int id PK
        int member_id FK
        int showtime_id FK
        text status
        numeric total_price
        timestamp created_at
    }

    BOOKING_SEATS {
        int id PK
        int booking_id FK
        int showtime_id FK
        int seat_id FK
    }

    WATCHLIST {
        int id PK
        int member_id FK
        int movie_id FK
        timestamp created_at
    }
```

### How the relationships work

- A **movie** has multiple **showtimes**. Each showtime takes place in one **screen**.
- A **screen** contains physical **seats**. A seat can be booked again for a different showtime.
- A **member** makes a **booking** for one showtime. **Booking seats** links that booking to each selected seat and also stores the showtime ID.
- **Watchlist** connects members and movies, allowing each member to save several films and each film to be saved by several members.

Seat availability is determined by looking for a matching seat/showtime pair attached to a `confirmed` booking. It is not a permanent property of the physical seat.

## Booking flow

```mermaid
sequenceDiagram
    participant User as React interface
    participant API as Express API
    participant DB as PostgreSQL
    User->>API: GET /showtimes/{showtimeId}/seats
    API->>DB: Load screening and seat availability
    DB-->>API: Screening and seats
    API-->>User: Available and booked seats
    User->>API: POST /bookings with auth cookie and seat IDs
    API->>API: Verify JWT and validate request
    API->>DB: BEGIN, then validate screening, seats and availability
    alt Selection is valid and available
        API->>DB: Insert booking and booking_seats, then COMMIT
        API-->>User: 201 booking confirmation
    else Invalid or already booked selection
        API->>DB: ROLLBACK
        API-->>User: Validation or conflict response
    end
```

The API rejects duplicate seat IDs, checks that seats belong to the screening's screen, and calculates the total using the database ticket price. Booking and seat inserts run in one transaction. This transaction alone does not establish protection against simultaneous reservations; database constraints and concurrent-request tests still need verification.

## Run locally

### Prerequisites

- Node.js and npm compatible with the included package manifests.
- A running PostgreSQL database with the application's schema and seed data.
- A Gemini API key for the recommendation feature.

**Database setup dependency:** This repository snapshot does not contain migrations, a schema dump, seed SQL or Docker Compose configuration. Restore the existing development database before running database-backed features. The ERD is documentation, not an executable schema.

### 1. Install dependencies

From the repository root:

```bash
npm ci
cd cinema-backend
npm ci
```

### 2. Configure the backend

Create `cinema-backend/.env` with your own values:

```dotenv
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/sheph_cinemas
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=5000
NODE_ENV=development
```

Do not commit actual credentials. The AI route currently names `gemini-3.5-flash-lite`; availability of that configured model has not been verified. Adjust the model in `cinema-backend/routes/ai.js` if required by your account.

### 3. Start the API

From `cinema-backend/`:

```bash
npm run dev
```

### 4. Start the frontend

In another terminal, from the repository root:

```bash
npm run dev
```

Open `http://localhost:5173`. Frontend requests currently use `http://localhost:5000`, and backend CORS allows `http://localhost:5173` with credentials. Keep these addresses aligned when changing ports.

`GET http://localhost:5000/health` checks that the API responds; it does not verify database connectivity.

## Main API routes

| Method        | Route                          | Purpose                                            |
| ------------- | ------------------------------ | -------------------------------------------------- |
| GET           | `/movies?status=now_showing`   | List movies, optionally filtered by release status |
| GET           | `/movies/:slug`                | Get a movie                                        |
| GET           | `/movies/:slug/showtimes`      | List screenings, formatted for Sydney time         |
| GET           | `/showtimes/:showtimeId/seats` | Get seats and availability                         |
| POST          | `/auth/register`               | Register a member                                  |
| POST          | `/auth/login`                  | Set authentication cookie                          |
| GET           | `/auth/me`                     | Get the current member                             |
| POST          | `/auth/logout`                 | Clear authentication cookie                        |
| POST          | `/bookings`                    | Create a booking; authentication required          |
| GET           | `/bookings/member/:memberId`   | Retrieve member booking history                    |
| GET           | `/bookings/:id`                | Retrieve a booking                                 |
| GET           | `/watchlist`                   | Get the signed-in member's watchlist               |
| POST / DELETE | `/watchlist/:movieId`          | Add or remove a saved movie                        |
| POST          | `/ai/recommend`                | Request catalogue-based recommendations            |

The current booking read routes do not enforce authentication or ownership checks. They need access controls before public deployment.

## Code guide

| Path                                       | Responsibility                                                |
| ------------------------------------------ | ------------------------------------------------------------- |
| `src/Pages/`                               | Movie browsing, booking, authentication, profile and AI pages |
| `src/Components/`                          | Seat selection, ticket selection, navigation and cards        |
| `src/context/AuthContext.jsx`              | Frontend authentication state                                 |
| `cinema-backend/index.js`                  | Express configuration and route mounting                      |
| `cinema-backend/routes/`                   | SQL queries and API handlers                                  |
| `cinema-backend/middleware/requireAuth.js` | JWT authentication middleware                                 |
| `cinema-backend/db/pool.js`                | PostgreSQL connection pool                                    |