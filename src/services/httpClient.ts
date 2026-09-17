import axios, { AxiosError } from "axios";
import type { ApiError } from "../types/api";


const AUTH_TOKEN_STORAGE_KEY = "auth_token";

export function getAccessToken(): string | null {
  //return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg5NzA5MTAwLCJpYXQiOjE3ODk2MjI3MDAsImp0aSI6ImU3MDlhNWE1NDc4MTQ4ZTlhOWVmNTdjMmQ4MzkwOTYwIiwidXNlcl9pZCI6IjYifQ.LgTDU9Ai-JIb5_EXKUNSibCnlGY4uuh7i_gP0gR-Ino";
}

const baseURL = "https://yas.it.com";

export const httpClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

// Central place to inject authentication once a token strategy exists.
// Example (kept ready, not active until a token source is wired up):
//
// httpClient.interceptors.request.use((config) => {
//   const token = getAuthToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Normalize error shape so callers can rely on a consistent structure.
    const axiosError = error as AxiosError<{ message?: string }>;

    const status = axiosError.response?.status ?? null;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Unknown error";

    if (status === 401) {
      const redirectPath = `${window.location.pathname}${window.location.search}`;
      window.location.href = `https://yas.it.com/cpanel/v2/store/login?redirect=${encodeURIComponent(redirectPath)}`;
    }

    const normalized: ApiError = { status, message, raw: error };

    return Promise.reject(normalized);
  },
);
