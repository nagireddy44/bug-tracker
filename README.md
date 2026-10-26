# Bug Tracker

A simple full-stack web application to report and track software bugs.

## Features
- Report bugs with a title and description.
- View all reported bugs.
- Update bug status to Open, In Progress, or Fixed.
- Delete bug reports.

## Tech Stack
- **Frontend:** React and Vite
- **Backend:** Node.js and Express
- **API:** REST API
- **Middleware:** CORS

## How to Run

### Start the Backend
```bash
cd backend
npm install
node index.js
```

Backend runs at `http://localhost:5000`.

### Start the Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal.

## API Endpoints
- `GET /api/bugs` — View all bugs
- `POST /api/bugs` — Report a bug
- `PATCH /api/bugs/:id` — Update bug status
- `DELETE /api/bugs/:id` — Delete a bug

## Note
Bug reports are stored in memory and reset when the backend server restarts.
