import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api/v1`;

const TOKEN_KEY = "bp_access_token";

type RetryableRequestConfig = {
  headers?: Record<string, string>;
  url?: string;
  _retry?: boolean;
};

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

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const response = await axios.post<{
    data: { accessToken: string; refreshToken: string };
  }>(
    `${BASE_URL}/users/refresh-token`,
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const newAccessToken = response.data?.data?.accessToken;
  if (!newAccessToken) {
    throw new Error("Unable to refresh session");
  }

  setStoredToken(newAccessToken);
  return newAccessToken;
};

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
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const messageFromBackend = error.response?.data?.message as
      | string
      | undefined;

    const canRetryWithRefresh =
      status === 401 &&
      !!originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== "/users/login" &&
      originalRequest.url !== "/users/register" &&
      originalRequest.url !== "/users/refresh-token" &&
      (messageFromBackend === "Access token expired" ||
        messageFromBackend === "jwt expired");

    if (canRetryWithRefresh && originalRequest) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        };

        return apiClient(originalRequest);
      } catch {
        clearStoredToken();
        window.dispatchEvent(new Event("bp:unauthorized"));
        return Promise.reject(
          new Error("Session expired. Please log in again."),
        );
      }
    }

    if (status === 401) {
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
