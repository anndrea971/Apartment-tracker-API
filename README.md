# Apartment Hunting Tracker API — W03 Part 1

An Express + MongoDB API for tracking apartment listings and the viewings
you schedule for them while apartment hunting.

## Project structure

```
apartment-tracker-api/
├── server.js               # entry point: loads env vars, connects to DB, mounts routes
├── db/
│   └── connect.js          # MongoDB connection (init/get), includes a DNS fix
├── controllers/
│   ├── apartments.js       # apartments CRUD + validation
│   └── viewings.js         # viewings CRUD + validation + apartment-exists check
├── routes/
│   ├── index.js             # top-level router + Swagger UI at /api-docs
│   ├── apartments.js
│   └── viewings.js
├── seed.js                  # optional: inserts 3 sample apartments + 1 viewing
├── apartments.rest          # ready-to-run test requests for every route
├── .env.example
└── .gitignore
```

## Collections

**apartments** (9 fields): address, rent, bedrooms, bathrooms, squareFootage,
petsAllowed, contactInfo, status, notes. `status` must be one of: interested,
contacted, viewing_scheduled, applied, rejected, offer_received.

**viewings**: apartmentId (must reference a real apartment), scheduledDate,
attended, rating (1-5), notes.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your MongoDB connection string.
   Use the **same cluster** as your Contacts project, but this new database
   name (`apartmentTrackerDB` by default, matching `DB_NAME`).
3. `npm run dev` — server starts on `http://localhost:3000`.
4. Optionally run `node seed.js` once to insert sample data.

## Endpoints

| Method | Path              | Description                                  |
|--------|-------------------|-----------------------------------------------|
| GET    | `/apartments`     | All apartments                               |
| GET    | `/apartments/:id` | One apartment by id                          |
| POST   | `/apartments`     | Create an apartment (all fields required)    |
| PUT    | `/apartments/:id` | Replace an apartment's fields                |
| DELETE | `/apartments/:id` | Delete an apartment                          |
| GET    | `/viewings`       | All viewings                                 |
| GET    | `/viewings/:id`   | One viewing by id                            |
| POST   | `/viewings`       | Create a viewing (apartmentId must exist)    |
| PUT    | `/viewings/:id`   | Replace a viewing's fields                   |
| DELETE | `/viewings/:id`   | Delete a viewing                             |

Interactive docs: `/api-docs`. Test file: `apartments.rest`.

## Deployment (Render)

- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `DB_NAME`
- MongoDB Atlas → Network Access → allow `0.0.0.0/0`
- **Important:** `swagger.js` has `host` set to a placeholder. Once you have
  your real Render URL, edit that value and run `node swagger.js` again
  before your final push, so `/api-docs` works correctly when deployed.
