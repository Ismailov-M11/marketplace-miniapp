import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "";

export const api = axios.create({
  baseURL: BASE,
  withCredentials: false,
});

let _token: string | null = null;

export function setAuthToken(token: string) {
  _token = token;
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function clearAuthToken() {
  _token = null;
  delete api.defaults.headers.common["Authorization"];
}

export function getAuthToken() {
  return _token;
}

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      clearAuthToken();
    }
    return Promise.reject(err);
  }
);
