import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api/v1`;

const TOKEN_KEY = "bp_access_token";

export const getStoredToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token: string): void =>
  localStorage.setItem(TOKEN_KEY, token);

export const clearStoredToken = (): void => localStorage.removeItem(TOKEN_KEY);

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor — attach Bearer token if present ─────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor — surface error messages, auto-logout on 401 ────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken();
      // Let the AuthContext / ProtectedRoute handle redirect
      window.dispatchEvent(new Event("bp:unauthorized"));
    }

    // Normalise the error message so callers always get a string
    const message: string =
      error.response?.data?.message ??
      error.message ??
      "An unexpected error occurred.";

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
