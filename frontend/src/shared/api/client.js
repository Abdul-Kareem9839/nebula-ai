import axios from "axios";

function normalizeBaseUrl(url) {
  if (!url) return "";

  const trimmedUrl = url.trim().replace(/\/+$/, "");
  if (!trimmedUrl) return "";

  return /\/api(?:\/|$)/i.test(trimmedUrl) ? trimmedUrl : `${trimmedUrl}/api`;
}

const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || "http://localhost:5000",
);

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nebula_token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nebula_token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
