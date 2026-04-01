# Buyer Portal Backend

## Environment Variables

Use `.env` in production (do not commit real values).

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| PORT | No | `8000` | API port |
| CORS_ORIGIN | Yes | `https://buyer-portal-beta.vercel.app` | Frontend origin allowed by CORS |
| DATABASE_URL | Yes | `postgresql://DB_USERNAME:DB_PASSWORD@DB_HOST:5432/DB_NAME?sslmode=require` | Include database username and password in the URL |
| ACCESS_TOKEN_SECRET | Yes | `change_me_access_secret` | JWT access secret |
| ACCESS_TOKEN_EXPIRY | No | `1d` | Access token TTL |
| REFRESH_TOKEN_SECRET | Yes | `change_me_refresh_secret` | JWT refresh secret |
| REFRESH_TOKEN_EXPIRY | No | `10d` | Refresh token TTL |
| CLOUDINARY_CLOUD_NAME | Optional | `your_cloud_name` | Media storage |
| CLOUDINARY_API_KEY | Optional | `your_api_key` | Media storage |
| CLOUDINARY_API_SECRET | Optional | `your_api_secret` | Media storage |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start backend in development mode |
| `npm run build` | Compile TypeScript |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prestart` | Generate Prisma client before start |

## Deployment Quick Steps

1. Install dependencies: `npm install`
2. Configure env: copy `.env.sample` to `.env` and set all required values.
3. Generate Prisma client: `npm run prisma:generate`
4. Build app: `npm run build`
5. Start with PM2 (example): `pm2 start npm --name backend -- run dev`

## Important

- If `DATABASE_URL` is missing, Prisma generation will fail.
- If Prisma generation fails, app boot will fail with missing generated client.
- Keep real usernames/passwords only in server `.env`, never in git.
