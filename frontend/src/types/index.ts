// ─── API envelope ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

// ─── Domain models (mirror backend Prisma schema) ────────────────────────────

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: "buyer" | "seller";
  createdAt: string;
  refreshToken: string | null;
}

export interface Property {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  price: number;
  /** Only present on getPropertyById */
  description?: string;
}

export interface Favourite {
  id: number;
  userId: number;
  propertyId: number;
  property: Property;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// ─── Request payloads ────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface AddFavouritePayload {
  propertyId: number;
}
