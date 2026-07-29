# Travel Manager

A small Express REST API + lightweight frontend for managing travel destinations and travel packages.

## Features

- Full CRUD for:
  - Destinations
  - Packages
- JSON-file persistence (`src/data/store.json`)
- Query filtering on API endpoints
- Custom middleware:
  - Request logging
  - Required-field validation
  - Centralized 404 + error handling
- Browser UI served by Express (`public/`)

## Tech Stack

- Node.js
- Express
- dotenv
- CommonJS modules
- `fs/promises` + `path`

## Project Structure

```text
travel-manager/
├─ public/
│  ├─ index.html
│  ├─ app.js
│  └─ styles.css
├─ src/
│  ├─ data/
│  │  ├─ dataStore.js
│  │  └─ store.json
│  ├─ middleware/
│  │  ├─ asyncHandler.js
│  │  ├─ errorHandler.js
│  │  ├─ requestLogger.js
│  │  └─ validateRequiredFields.js
│  ├─ routes/
│  │  ├─ destinations.js
│  │  └─ packages.js
│  └─ server.js
├─ .env.example
├─ eslint.config.js
└─ package.json
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Start the app:

```bash
npm start
```

Server runs on `http://localhost:3000` by default.

## Environment Variables

From `.env.example`:

- `PORT` — server port (default: `3000`)
- `DATA_FILE` — JSON data file path (default fallback: `src/data/store.json`)

## UI

Open:

- `http://localhost:3000`

UI supports:

- Add/Edit/Delete destinations
- Add/Edit/Delete packages
- Keyword filtering across destinations and related packages
- Clear filter reset

## API Endpoints

Base URL: `http://localhost:3000/api`

### Health

- `GET /health` → `200`

### Destinations

- `GET /destinations` → list destinations (`200`)
- `GET /destinations?destination=<keyword>` → filter by destination name (`200`)
- `GET /destinations?country=<keyword>` → filter by country (`200`)
- `GET /destinations/:id` → single destination (`200`, `404`)
- `POST /destinations` → create (`201`, `400`)
- `PUT /destinations/:id` → update (`200`, `400`, `404`)
- `DELETE /destinations/:id` → delete (`204`, `404`)

Required body for create/update:

```json
{
  "name": "Santorini",
  "country": "Greece",
  "description": "Island destination with beaches and sunsets"
}
```

### Packages

- `GET /packages` → list packages (`200`)
- `GET /packages?destinationId=<id>` → filter by destination id (`200`)
- `GET /packages/:id` → single package (`200`, `404`)
- `POST /packages` → create (`201`, `400`)
- `PUT /packages/:id` → update (`200`, `400`, `404`)
- `DELETE /packages/:id` → delete (`204`, `404`)

Required body for create/update:

```json
{
  "title": "Kyoto Highlights",
  "destinationId": 2,
  "price": 1499,
  "durationDays": 4
}
```

## Example cURL

Create destination:

```bash
curl -X POST http://localhost:3000/api/destinations \
  -H "Content-Type: application/json" \
  -d '{"name":"Lisbon","country":"Portugal","description":"Historic neighborhoods"}'
```

Create package:

```bash
curl -X POST http://localhost:3000/api/packages \
  -H "Content-Type: application/json" \
  -d '{"title":"Lisbon Culture Getaway","destinationId":7,"price":1299,"durationDays":5}'
```

## Linting

Run ESLint:

```bash
npm run lint
```
