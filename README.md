# Apartment Hunting Tracker API — W04 Part 2 (Authentication)

An Express + MongoDB API for tracking apartment listings and scheduled
viewings, now secured with GitHub OAuth.

## Project structure

```
apartment-tracker-api/
├── server.js                # entry point: env vars, sessions, passport, DB, routes
├── auth/
│   └── passport.js          # GitHub OAuth strategy + session serialize/deserialize
├── middleware/
│   └── ensureAuth.js        # blocks a route with 401 unless logged in
├── db/
│   └── connect.js
├── controllers/
│   ├── apartments.js
│   └── viewings.js
├── routes/
│   ├── index.js              # mounts /auth, /apartments, /viewings, /api-docs
│   ├── auth.js               # /auth/github, /callback, /success, /failure, /logout, /status
│   ├── apartments.js
│   └── viewings.js
├── seed.js
├── apartments.rest
├── .env.example
└── .gitignore
```

## What's protected

All `GET` routes are public. Every `POST`, `PUT`, and `DELETE` route on both
`/apartments` and `/viewings` requires being logged in — 6 protected routes
in total, well past the "at least two" requirement.

## Setup

1. `npm install`
2. Create a GitHub OAuth App at https://github.com/settings/developers →
   OAuth Apps → New OAuth App:
   - Homepage URL: your Render URL
   - Authorization callback URL: `<your Render URL>/auth/github/callback`
3. Copy `.env.example` to `.env` and fill in: `MONGODB_URI`, `DB_NAME`,
   the three `GITHUB_*` values from the OAuth App you just created, and a
   random `SESSION_SECRET`.
4. `npm run dev` — server starts on `http://localhost:3000`.

Note: the OAuth callback URL must exactly match what's registered on
GitHub, so local login (`http://localhost:3000/...`) won't work against an
OAuth App configured for your Render URL. Easiest path: do all OAuth
testing directly on the deployed site, since that's what's graded anyway.

## How to log in while testing

1. In a browser, visit `<your Render URL>/auth/github` and approve access.
2. Without closing that tab, open `<your Render URL>/api-docs` in a **new
   tab in the same browser** — the session cookie is shared automatically.
3. "Try it out" on any protected (lock icon) route now works. Log out any
   time at `<your Render URL>/auth/logout`.

Protected routes tested directly from `apartments.rest` will correctly
return 401, since that file doesn't carry your browser's session cookie —
use Swagger UI for anything protected.

## Endpoints

| Method | Path                    | Auth required | Description                        |
|--------|-------------------------|:---:|--------------------------------------------|
| GET    | `/auth/github`          |     | Starts GitHub login                        |
| GET    | `/auth/logout`          |     | Ends the session                           |
| GET    | `/auth/status`          |     | Reports whether you're currently logged in |
| GET    | `/apartments`           |     | All apartments                             |
| GET    | `/apartments/:id`       |     | One apartment by id                        |
| POST   | `/apartments`           | ✅  | Create an apartment                        |
| PUT    | `/apartments/:id`       | ✅  | Replace an apartment's fields              |
| DELETE | `/apartments/:id`       | ✅  | Delete an apartment                        |
| GET    | `/viewings`             |     | All viewings                               |
| GET    | `/viewings/:id`         |     | One viewing by id                          |
| POST   | `/viewings`             | ✅  | Create a viewing (apartmentId must exist)  |
| PUT    | `/viewings/:id`         | ✅  | Replace a viewing's fields                 |
| DELETE | `/viewings/:id`         | ✅  | Delete a viewing                           |

Interactive docs: `/api-docs`.

## Deployment (Render)

- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `DB_NAME`, `GITHUB_CLIENT_ID`,
  `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL`, `SESSION_SECRET`
- MongoDB Atlas → Network Access → allow `0.0.0.0/0`
