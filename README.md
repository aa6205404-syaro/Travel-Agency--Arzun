# Arzun Travel Agency

A simple full-stack travel agency website powered by a lightweight Node.js server and a static landing page. The site showcases curated itineraries, FAQs, and a quote request form that posts to the backend.

## Getting started
1. (Optional) Install dependencies if you want `npm` scripts, though none are required:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   The site runs at http://localhost:3000.

## API routes
- `GET /api/destinations` — returns featured itineraries.
- `GET /api/faqs` — returns common questions.
- `POST /api/quote` — accepts quote requests (logged in the server for now).

## Project structure
- `server.js` — Node.js server, API routes, and static file hosting.
- `data/` — JSON seed data for destinations and FAQs.
- `public/` — frontend (HTML, CSS, JS).

## Customization
- Update `data/destinations.json` to add or tweak itineraries.
- Adjust styles in `public/styles.css` and UI behavior in `public/app.js`.
