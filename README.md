# HealthBridge — AI-Powered Preventive Healthcare Platform

A full-stack MERN application combining an AI health assistant, wellness
scoring, personalized health education, and real doctor appointment booking.

## Tech stack

- **Frontend:** React 19 + Vite, React Router, Tailwind CSS, Recharts, Lucide icons
- **Backend:** Node.js + Express, MongoDB + Mongoose, JWT auth
- **AI:** Optional live integration with the Anthropic Claude API, with a
  built-in rule-based fallback so the app works fully offline with no API key

## Features

- Email/password auth with role-based access (patient / doctor)
- Patient health profile (lifestyle, vitals, habits)
- AI-generated wellness score across 5 categories with personalized recommendations
- Personalized learning path with lessons + quizzes that award points
- Free-browse education hub, independent of the personalized path
- AI Health Assistant chat with emergency-symptom detection
- Doctor directory with search/filter, and appointment booking
- Doctor dashboard: today's schedule, appointment requests, patient list,
  accept/decline/complete workflow with clinical notes
- Progress tracking with charts (wellness score over time, module completion)
- Editable profile/settings for both patients and doctors

## Project structure

```
healthbridge/
├── client/     # React + Vite frontend
└── server/     # Express + MongoDB backend
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local, or a free cluster on MongoDB Atlas)

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set:

- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `ANTHROPIC_API_KEY` — **optional.** Leave blank to use the built-in
  offline AI engine. Add a key from https://console.anthropic.com to have
  the AI Health Assistant answer with a real Claude model instead.

Seed some demo data (optional but recommended for a first look):

```bash
npm run seed
```

This creates 4 demo doctors and 1 demo patient, all with the password
`Password123!`, plus a filled health profile, wellness assessment,
learning path, and a mix of appointments so the app isn't empty on first
login. The script prints all the demo email addresses when it finishes.

Start the API server:

```bash
npm run dev      # with auto-reload (nodemon)
# or
npm start
```

The API runs on `http://localhost:5000` by default.

### 2. Frontend setup

In a second terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173` by default and talks to the API
at the URL set in `client/.env` (`VITE_API_URL`, defaults to
`http://localhost:5000/api`).

### 3. Log in

If you ran the seed script, use:

- **Patient:** `patient@healthbridge.demo` / `Password123!`
- **Doctor:** `dr.ananya@healthbridge.demo` / `Password123!` (or any of the
  other seeded doctor emails printed by the seed script)

Otherwise, register a new account from the app — you can sign up as either
a patient or a doctor.

## Building for production

```bash
cd client
npm run build
```

This outputs a static build in `client/dist`, which can be served by any
static host or reverse-proxied alongside the Express API.

## Notes

- The AI Health Assistant is an educational tool, not a diagnostic system.
  It is designed to help patients organize symptoms and decide when to book
  a real doctor's appointment, and clearly escalates when a message contains
  potential emergency-symptom language.
- All protected routes require a JWT, automatically attached by the frontend
  API client from `localStorage`.
