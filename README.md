# Credit Scoring Backend (Node/Express)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your DB credentials and a JWT secret:
   ```
   cp .env.example .env
   ```

3. Create the database and tables:
   ```
   mysql -u root -p < config/schema.sql
   ```

4. Start the server:
   ```
   npm run dev
   ```
   Server runs on `http://localhost:5000` by default.

## Endpoints

- `POST /auth/signup` — create a lender/admin account
- `POST /auth/login` — returns a JWT
- `POST /applicants` — create an applicant profile with alt-data features (requires auth)
- `GET /applicants` — list all applicants with latest scores (requires auth)
- `GET /applicants/:id` — get one applicant's profile + score history (requires auth)
- `POST /score` — `{ applicantId }` — calls the ML microservice, stores and returns the score (requires auth)

## Notes

- This backend expects the Python ML microservice (KAN-18) to be running and reachable at `ML_SERVICE_URL` (see `.env`), exposing a `POST /score` endpoint that returns `{ score, risk_tier, explanation }`.
- All routes except `/auth/*` require a `Authorization: Bearer <token>` header.
