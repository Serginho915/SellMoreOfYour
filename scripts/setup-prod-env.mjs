import crypto from 'crypto';
import fs from 'fs';

const file = '.env.production';
if (fs.existsSync(file)) {
  console.log(`${file} already exists; leaving it unchanged.`);
} else {
  const secret = () => crypto.randomBytes(32).toString('base64url');
const content = `POSTGRES_DB=sellmoreofyour
POSTGRES_USER=sellmoreofyour
POSTGRES_PASSWORD=${secret()}
VITE_API_URL=https://sellmoreofyour.com
VITE_GA_MEASUREMENT_ID=
LOCAL_SUPERADMIN_EMAIL=admin@sellmoreofyour.local
LOCAL_SUPERADMIN_PASSWORD=${secret()}
GENERATION_TIMEZONE=Europe/Sofia
`;

  fs.writeFileSync(file, content, { mode: 0o600 });
  console.log(`${file} created. Review domains before production deploy.`);
}

const secret = () => crypto.randomBytes(32).toString('base64url');
const backendFile = 'backend/.env.production';
if (!fs.existsSync(backendFile)) {
  const backendContent = `NODE_ENV=production
PORT=4000
REDIS_URL=redis://redis:6379
CORS_ORIGIN=https://sellmoreofyour.com
SITE_URL=https://sellmoreofyour.com
JWT_SECRET=${secret()}
REFRESH_TOKEN_SECRET=${secret()}
OPENROUTER_API_KEY=
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct
OPENROUTER_SITE_URL=https://sellmoreofyour.com
OPENROUTER_TIMEOUT_MS=300000
OPENROUTER_MAX_INPUT_CHARS=16000
OPENROUTER_MAX_OUTPUT_TOKENS=9000
OPENROUTER_TEMPERATURE=0.7
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
`;
  fs.writeFileSync(backendFile, backendContent, { mode: 0o600 });
  console.log(`${backendFile} created. Keep JWT_SECRET and REFRESH_TOKEN_SECRET stable.`);
}
