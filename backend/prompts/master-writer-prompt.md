# SellMoreOfYour Master Prompt

The runtime default master prompt lives in `backend/src/data/masterPrompt.ts`.

On first startup, the backend stores that prompt in PostgreSQL under the `admin_settings` table. After that, edit it from `/admin` so production changes are saved in the database instead of requiring a code deploy.
