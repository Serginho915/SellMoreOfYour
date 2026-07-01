# SellMoreOfYour

Full-stack SellMoreOfYour publishing platform with a Vite React frontend, secure Express backend, PostgreSQL runtime storage, admin publishing, OpenRouter AI generation, and Docker dev/prod environments.

## Stack

- Frontend: Vite, React, TypeScript, SCSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Service dependency: Redis
- AI: OpenRouter API
- Newsletter: Nodemailer-ready SMTP env
- Infra: Docker, Docker Compose

## Project Structure

- `backend/src/index.ts` wires middleware, routes, schema bootstrap, scheduler, and error handling.
- `backend/src/routes/*` contains API modules.
- `backend/src/services/*` contains PostgreSQL stores, auth, OpenRouter, sanitization, audit logging, and scheduler logic.
- `frontend/src/App.tsx` contains the Vite SPA router, pages, admin UI, and reusable UI sections.
- `frontend/src/styles.scss` contains the SellMoreOfYour dark editorial visual system.

Runtime data lives in PostgreSQL, not JSON files or container filesystems. Local sample posts are in `backend/src/data/samplePosts.ts` and are inserted into PostgreSQL only when the table is empty.

## Local Docker

Copy env templates if needed:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Preferred local rebuild command, avoiding Docker Desktop BuildKit/Bake hangs:

```bash
npm run docker:rebuild
```

It runs classic Docker builds for backend and frontend, then starts Compose with `--no-build`.

Standard Compose also exists:

```bash
docker compose up -d --build
```

If that hangs on `load local bake definitions` or `listing workers`, use `npm run docker:rebuild`.

Services:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api/health
- Admin: http://localhost:3000/admin

The `admin-seed` service creates/updates a local admin and may exit with code `0`. Defaults:

- Email: `admin@sellmoreofyour.local`
- Password: `MySecretPassword123!`

Override with `LOCAL_SUPERADMIN_EMAIL` and `LOCAL_SUPERADMIN_PASSWORD`.

To create a superadmin manually:

```bash
cd backend
LOCAL_SUPERADMIN_EMAIL=admin@sellmoreofyour.local LOCAL_SUPERADMIN_PASSWORD='replace-me' npm run create-superadmin
```

## OpenRouter

Set `OPENROUTER_API_KEY` in `.env`, `backend/.env`, or the production env file. The default model is:

```bash
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct
```

The master prompt is seeded from `backend/src/data/masterPrompt.ts`, stored in the `admin_settings` table, and editable from `/admin` under AI generation settings.

## Auth

Admin users are stored in PostgreSQL. The app stores only `password_hash`, never plain passwords.

Auth uses:

- bcrypt password hashing
- short-lived JWT access token
- httpOnly refresh cookie
- hashed refresh tokens in PostgreSQL
- CSRF token check on refresh
- rate limiting on auth endpoints
- audit events for auth, settings, posts, and generation

Do not use env-based admin passwords for runtime login.

## Production Secrets

Generate secrets:

```bash
npm run generate-secrets
npm run setup:prod-env
```

Keep these stable across deploys:

- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `POSTGRES_PASSWORD`

Changing them logs admins out or changes database access.

## Production Docker

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
```

Production ports:

- Frontend: host `8080` -> container `3000`
- Backend: host `4000` -> container `4000`
- PostgreSQL and Redis are internal only.

Backend refuses to start in production if required secrets are missing, equal, too short, or production URLs still point to localhost.

## API Summary

- `GET /api/health`
- `GET /api/posts`
- `GET /api/posts/search?q=term`
- `GET /api/posts/:slug`
- `POST /api/subscribe`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/admin/posts`
- `POST /api/admin/posts`
- `PUT /api/admin/posts/:slug`
- `DELETE /api/admin/posts/:slug`
- `GET /api/admin/settings`
- `PUT /api/admin/settings`
- `POST /api/ai/generate-article`

## Backups

PostgreSQL volumes hold users, posts, settings, subscribers, refresh tokens, and audit events. `docker compose up -d --build` is safe for data. `docker compose down -v` deletes the database volume and all runtime data.

Example local backup:

```bash
docker compose exec postgres pg_dump -U sellmoreofyour -d sellmoreofyour > sellmoreofyour-backup.sql
```

Example restore into the local database:

```bash
docker compose exec -T postgres psql -U sellmoreofyour -d sellmoreofyour < sellmoreofyour-backup.sql
```
