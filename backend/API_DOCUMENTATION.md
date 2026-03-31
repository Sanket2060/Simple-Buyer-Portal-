# API Documentation — Buyer Portal

**Base URL:** `http://localhost:8000/api/v1`

---

## Table of Contents

1. [User Endpoints](#user-endpoints)
   - [Sign Up](#1-sign-up)
   - [Login](#2-login)
2. [Property Endpoints](#property-endpoints)
   - [Get All Properties](#1-get-all-properties)
   - [Get Property by ID](#2-get-property-by-id)
3. [Favourite Endpoints](#favourite-endpoints)
   - [Get Favourites](#1-get-favourite-properties)
   - [Add Favourite](#2-add-favourite-property)
   - [Remove Favourite](#3-remove-favourite-property)
4. [Authentication](#authentication)
5. [Models](#models)
6. [Response Format](#response-format)
7. [Error Handling](#error-handling)
8. [Route Setup](#route-setup)

---

## User Endpoints

### 1. Sign Up

**Endpoint:** `POST /users/register`

**Description:** Create a new buyer account. The `role` is automatically set to `"buyer"` — it does not need to be supplied by the client.

**Request Body:**

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Validation rules:**

| Field      | Rule                              |
| ---------- | --------------------------------- |
| `fullName` | string, min 2 chars, max 50 chars |
| `email`    | valid email format                |
| `password` | string, min 6 chars, max 20 chars |

**Response (201):**

```json
{
  "statusCode": 201,
  "data": {
    "id": 1,
    "email": "jane@example.com",
    "fullName": "Jane Doe",
    "role": "buyer",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "refreshToken": null
  },
  "message": "User registered successfully"
}
```

> **Note:** The password hash is never included in any response.

**Errors:**

| Code  | Reason                                                           |
| ----- | ---------------------------------------------------------------- |
| `400` | Validation error (missing fields, short password, invalid email) |
| `409` | An account with that email already exists                        |
| `500` | Server error                                                     |

---

### 2. Login

**Endpoint:** `POST /users/login`

**Description:** Authenticate an existing user and receive a JWT access token. The token is returned both in the response body and set as an `httpOnly` cookie.

**Request Body:**

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "id": 1,
      "email": "jane@example.com",
      "fullName": "Jane Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Logged in successfully"
}
```

**Cookies Set:**

| Cookie         | Flags                                  |
| -------------- | -------------------------------------- |
| `accessToken`  | `httpOnly`, `secure` (production only) |
| `refreshToken` | `httpOnly`, `secure` (production only) |

**Errors:**

| Code  | Reason                           |
| ----- | -------------------------------- |
| `400` | Validation error                 |
| `401` | Incorrect password               |
| `404` | No account found with that email |
| `500` | Server error                     |

---

## Property Endpoints

> **Authentication:** All property endpoints require a valid JWT (Bearer token or cookie).

### 1. Get All Properties

**Endpoint:** `GET /properties/getAllProperties`

**Description:** Returns all properties. The `description` field is intentionally omitted from this list — fetch a single property by ID to get the full details.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "title": "Luxury Apartment",
      "location": "Downtown NYC",
      "imageUrl": "https://example.com/image1.jpg",
      "price": 500000
    },
    {
      "id": 2,
      "title": "Cozy House",
      "location": "Suburbs",
      "imageUrl": "https://example.com/image2.jpg",
      "price": 350000
    }
  ],
  "message": "Properties fetched successfully"
}
```

**Errors:**

| Code  | Reason       |
| ----- | ------------ |
| `401` | Unauthorized |
| `500` | Server error |

---

### 2. Get Property by ID

**Endpoint:** `GET /properties/getPropertyById/:id`

**Description:** Returns full details for a single property, including its `description`.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**URL Parameters:**

| Name | Type   | Description |
| ---- | ------ | ----------- |
| `id` | number | Property ID |

**Example:**

```
GET /properties/getPropertyById/1
```

**Response (200):**

```json
{
  "statusCode": 200,
  "data": {
    "id": 1,
    "title": "Luxury Apartment",
    "location": "Downtown NYC",
    "description": "Beautiful 3-bedroom apartment with amazing city views.",
    "imageUrl": "https://example.com/image1.jpg",
    "price": 500000
  },
  "message": "Property fetched successfully"
}
```

**Errors:**

| Code  | Reason             |
| ----- | ------------------ |
| `401` | Unauthorized       |
| `404` | Property not found |
| `500` | Server error       |

---

## Favourite Endpoints

> **Authentication:** All favourite endpoints require a valid JWT (Bearer token or cookie).

### 1. Get Favourite Properties

**Endpoint:** `GET /favourites/favourites`

**Description:** Returns all properties the authenticated user has saved. The user ID is derived from the JWT — no user ID is needed in the request.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "propertyId": 5,
      "property": {
        "id": 5,
        "title": "Modern Villa",
        "location": "Coastal Area",
        "description": "Spacious villa near the beach.",
        "imageUrl": "https://example.com/villa.jpg",
        "price": 750000
      }
    }
  ],
  "message": "Property fetched successfully"
}
```

**Errors:**

| Code  | Reason       |
| ----- | ------------ |
| `401` | Unauthorized |
| `500` | Server error |

---

### 2. Add Favourite Property

**Endpoint:** `POST /favourites/favourites`

**Description:** Saves a property to the authenticated user's favourites.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "propertyId": 5
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "data": {
    "id": 1,
    "userId": 1,
    "propertyId": 5
  },
  "message": "Property added to favorites"
}
```

**Errors:**

| Code  | Reason                    |
| ----- | ------------------------- |
| `400` | `propertyId` not provided |
| `401` | Unauthorized              |
| `500` | Server error              |

---

### 3. Remove Favourite Property

**Endpoint:** `DELETE /favourites/favourites/:id`

**Description:** Removes a property from the authenticated user's favourites. The `:id` parameter is the **property ID**, not the favourite record ID.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**URL Parameters:**

| Name | Type   | Description                  |
| ---- | ------ | ---------------------------- |
| `id` | number | ID of the property to remove |

**Example:**

```
DELETE /favourites/favourites/5
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Property removed from favorites"
}
```

**Errors:**

| Code  | Reason                    |
| ----- | ------------------------- |
| `400` | `propertyId` not provided |
| `401` | Unauthorized              |
| `500` | Server error              |

---

## Authentication

### How tokens work

1. Call `POST /users/login` — receive `accessToken` in the response body and as an `httpOnly` cookie.
2. For subsequent requests, pass the token in the `Authorization` header:
   ```
   Authorization: Bearer <accessToken>
   ```
3. Alternatively, if the client supports cookies, the token is sent automatically via the `accessToken` cookie.

### Protected endpoints

| Method   | Endpoint                          | Description                       |
| -------- | --------------------------------- | --------------------------------- |
| `GET`    | `/properties/getAllProperties`    | List all properties               |
| `GET`    | `/properties/getPropertyById/:id` | Get single property               |
| `GET`    | `/favourites/favourites`          | Get user's favourites             |
| `POST`   | `/favourites/favourites`          | Add a property to favourites      |
| `DELETE` | `/favourites/favourites/:id`      | Remove a property from favourites |

### Public endpoints

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| `POST` | `/users/register` | Create an account |
| `POST` | `/users/login`    | Authenticate      |

---

## Models

### User

```typescript
{
  id: number;
  email: string; // unique
  fullName: string;
  role: "buyer"; // always "buyer" — set automatically on registration
  createdAt: Date;
  refreshToken: string | null;
  // password is never returned in any response
}
```

### Property

```typescript
{
  id: number;
  title: string;
  location: string;
  description: string; // only returned by getPropertyById
  imageUrl: string;
  price: number;
}
```

### Favourite

```typescript
{
  id: number;
  userId: number;
  propertyId: number;
  property: Property; // included via Prisma relation
}
```

---

## Response Format

Every response follows this envelope:

```json
{
  "statusCode": number,
  "data":       any,
  "message":    string
}
```

---

## Error Handling

All errors follow this shape:

```json
{
  "statusCode": number,
  "message":    string
}
```

**Status code reference:**

| Code  | Meaning                            |
| ----- | ---------------------------------- |
| `200` | OK                                 |
| `201` | Created                            |
| `400` | Bad Request (validation failure)   |
| `401` | Unauthorized (missing/invalid JWT) |
| `404` | Not Found                          |
| `409` | Conflict (e.g. duplicate email)    |
| `500` | Internal Server Error              |

---

## Route Setup

All routes are mounted in `src/app.ts`:

```typescript
// src/app.ts
app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/favourites", favouriteRouter);
```

### `src/routes/user.route.ts`

```typescript
router.post("/register", registerUser); // public
router.post("/login", loginUser); // public
```

### `src/routes/property.route.ts`

```typescript
router.use(verifyJWT); // all property routes require auth

router.get("/getAllProperties", getAllProperties);
router.get("/getPropertyById/:id", getPropertyById);
```

### `src/routes/favourite.route.ts`

```typescript
router.use(verifyJWT); // all favourite routes require auth

router.get("/favourites", getFavouritePropertiesById);
router.post("/favourites", addFavouriteProperty);
router.delete("/favourites/:id", removeFavouriteProperty);
```
