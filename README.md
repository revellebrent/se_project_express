# WTWR (What To Wear?) — Backend API

## Express + MongoDB REST API for the WTWR app. Handles users, authentication, and clothing items (CRUD + likes), with validation, logging, and production deployment (nginx + PM2 + HTTPS).

## Live

- Frontend: https://wardrobe411.csproject.org

- API base URL: https://api.wardrobe411.csproject.org

- Frontend repo (public): https://github.com/revellebrent/se_project_react

- 🧪 Crash test (for reviewer): GET https://api.wardrobe411.csproject.org/crash-test
Intentionally crashes the Node process; PM2 auto-restarts it. (Removed after review.)

## Features

- Users: signup, signin (JWT), get/update current user

- Clothing items: list, create, delete (owner-only), like/unlike

- Input validation with celebrate/Joi + custom URL validator (validator.isURL)

- Centralized error handling with custom error classes

- Request & error logging via winston / express-winston (file + console)

- CORS enabled (currently permissive; adjust as needed)

- Production hardening: PM2, nginx reverse proxy, HTTPS (Let’s Encrypt/       Certbot)

## Tech Stack

- Node.js, Express

- MongoDB 8.x, Mongoose

- JWT (auth), bcryptjs (password hashing)

- celebrate/Joi, validator (validation)

- winston, express-winston (logging)

## API Overview
### Auth

- POST /signup — Create user { name, avatar, email, password }

- POST /signin — Login { email, password } → { token }

## Users

- GET /users/me — Get current user

- PATCH /users/me — Update { name, avatar }

### Items

- GET /items — List all items (public)

- POST /items — Create { name, imageUrl, weather } (auth)

- DELETE /items/:itemId — Delete (owner-only, auth)

- PUT /items/:itemId/likes — Like (auth)

- DELETE /items/:itemId/likes — Unlike (auth)

Auth header: Authorization: Bearer <JWT>

## Validation

Defined in middlewares/validation.js using celebrate/Joi with custom URL checks:

- Items (create): name (2–30), imageUrl (URL), weather (string)

- Users (signup): name (2–30), avatar (URL), email (email), password (required)

- Login: email, password

- IDs (params): 24-char hex (itemId, userId)

Celebrate error middleware (app.use(errors())) is enabled before the centralized handler.

## Error Handling

Centralized handler + custom error classes:

- bad-request-err, unauthorized-err, forbidden-err, not-found-err,     conflict-err

Typical response:

{ "message": "Human-readable error message" }

## Logging

middlewares/logger.js configures:

- Request logs: console (formatted) + request.log (JSON)

- Error logs: console (formatted) + error.log (JSON)

## Environment

The app reads environment variables via dotenv (loaded at the top of app.js).

Create a .env (not committed) on the server:

NODE_ENV=production
JWT_SECRET=<your-256-bit-hex-key>
PORT=3001  optional (defaults to 3001)


JWT secret is required in production. Use:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));“

MongoDB: the app connects to mongodb://127.0.0.1:27017/wtwr_db (configured in app.js).
Update there if you need a different URI.

## Run Locally

Prereqs: Node 20+ (works on 22), MongoDB running locally.

git clone https://github.com/revellebrent/se_project_express.git
cd se_project_express
npm install
npm start
# Server: http://localhost:3001


Quick checks:

curl http://localhost:3001/items
curl -X POST http://localhost:3001/items
# → Authorization required

## Deployment Notes (already configured)

- Process manager: PM2 (pm2 start app.js, pm2 save, pm2 startup)

- Reverse proxy: nginx

- api.wardrobe411.csproject.org → proxies to Node on port 3001

- wardrobe411.csproject.org & www.wardrobe411.csproject.org serve static frontend (/home/revellebrent/frontend)

- HTTPS: Let’s Encrypt via Certbot (auto-renew)

- Firewall: HTTP(80)/HTTPS(443) open; custom 3001 open internally

## Project Structure (abridged)
<details>
<summary>Click to expand</summary>

```text
se_project_express/
├─ app.js
├─ controllers/
│  ├─ items.js
│  └─ users.js
├─ middlewares/
│  ├─ auth.js
│  ├─ error-handler.js
│  ├─ logger.js
│  └─ validation.js
├─ routes/
│  ├─ index.js
│  ├─ items.js
│  └─ users.js
├─ models/
│  ├─ clothingItem.js
│  └─ user.js
├─ errors/
│  ├─ bad-request-err.js
│  ├─ conflict-err.js
│  ├─ forbidden-err.js
│  ├─ not-found-err.js
│  └─ unauthorized-err.js
├─ utils/
│  └─ config.js
├─ .gitignore
├─ package.json
└─ README.md

## Reviewer Notes

- Crash recovery: GET /crash-test will crash the app; PM2 restarts automatically.

- Frontend uses API at: https://api.wardrobe411.csproject.org (via process.env.NODE_ENV === "production" switch)
