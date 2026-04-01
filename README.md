# Buyer Portal


## Assessment Context

Task: Auth + Simple Buyer Portal (Favourites)

This project implements:

1. User registration and login with email/password.
2. JWT-based authentication with access + refresh token flow.
3. Buyer dashboard with property listing and favourites management.
4. Ownership enforcement so users can only read/modify their own favourites.
5. Basic validation, error handling, and Prisma/PostgreSQL data layer.
6. Frontend login/register/dashboard/property/favourites flow.

## What Is Built

### Backend

- Express + TypeScript API
- Prisma ORM with PostgreSQL
- Password hashing using bcrypt
- JWT access token + refresh token rotation
- Global API error middleware with consistent JSON error responses
- CORS configured for frontend origin (localhost:5173)

### Frontend

- React + TypeScript + Vite
- React Router protected/public route guards
- Axios client with auth interceptors
- Auto refresh of expired access token and retry of failed request
- React Query for server state, caching, and optimistic updates
- Clear error messages and feedback states

## Strong Features In This App

- Token refresh flow: expired access tokens are refreshed automatically (better UX than forced logout).
- Ownership-safe favourites: all favourite operations use authenticated user identity from JWT.
- Optimistic UI updates: add/remove favourite feels instant.
- Good UX feedback: skeleton loaders, error banners, toast messages, and empty states.
- Validation and security basics: Zod input validation, hashed passwords, HttpOnly auth cookies.
- Seeded Nepal context data: realistic Nepal locations and property examples.

## Project Structure

- backend: API, auth, Prisma schema, seed script
- frontend: React app, pages, hooks, API client

## Database Design

Prisma models:

- User
  - id, email (unique), password (hashed), fullName, role, createdAt, refreshToken
- Property
  - id, title, location, description, imageUrl, price
- Favourite
  - id, userId, propertyId
  - unique compound key on (userId, propertyId)

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL database (local or hosted)

## Environment Variables

Create backend/.env with values similar to:

```env
PORT=8000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d

NODE_ENV=development
```

Create frontend/.env:

```env
VITE_BACKEND_URL=http://localhost:8000
```

## How To Run

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Run migrations / generate client

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 3) Seed sample properties (Nepal-based)

```bash
cd backend
npx ts-node -r dotenv/config prisma/seed.ts
```

### 4) Start backend

```bash
cd backend
npm run dev
```

Backend runs on http://localhost:8000

### 5) Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173

## Example User Flow

1. Open frontend at http://localhost:5173
2. Register a new account.
3. Login with the created account.
4. You are redirected to dashboard.
5. Browse properties.
6. Open a property detail and click Add to Favourites.
7. Navigate to Favourites page and verify saved properties.
8. Remove a favourite and verify it disappears.

## Main API Endpoints

Base: /api/v1

Auth:

- POST /users/register
- POST /users/login
- POST /users/refresh-token

Properties (protected):

- GET /properties/getAllProperties
- GET /properties/getPropertyById/:id

Favourites (protected):

- GET /favourites/favourites
- POST /favourites/favourites
- DELETE /favourites/favourites/:id

Detailed API examples are available in backend/API_DOCUMENTATION.md

## Auth Behavior

- Access token is used for API requests.
- If access token expires:
  - backend returns 401 with user-friendly message.
  - frontend interceptor calls refresh-token endpoint.
  - request is retried automatically with new access token.
- If refresh token is invalid/expired:
  - frontend clears auth state and redirects to login.

## Validation and Error Handling

- Zod used for request validation.
- API errors use a consistent JSON format:

```json
{
  "statusCode": 401,
  "message": "Session expired. Please log in again.",
  "success": false
}
```

## Deployment
It's live on https://buyer-portal-beta.vercel.app/ 
Frontend : Vercel
Backend  : Digital Ocean

Test credentials for the live:
email: sanketkarki2060@gmail.com
Password: 123456karki
Or,
You can simply signup.

## Notes

- This implementation focuses on the take-home requirements and clear separation between frontend and backend.
- Security baseline is implemented (hashing, JWT, auth checks), and can be extended with stricter cookie policies and CSRF strategy for production.
