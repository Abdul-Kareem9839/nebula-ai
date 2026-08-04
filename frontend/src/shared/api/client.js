import axios from "axios";

function normalizeBaseUrl(url) {
  if (!url) return "";

  const trimmedUrl = url.trim().replace(/\/+$/, "");
  if (!trimmedUrl) return "";

  // Ensure the base URL ends with /api exactly once.
  return /\/api(?:\/|$)/i.test(trimmedUrl) ? trimmedUrl : `${trimmedUrl}/api`;
}

const BASE_URLS = Array.from(
  new Set(
    (import.meta.env.PROD
      ? [import.meta.env.VITE_API_URL]
      : [
          import.meta.env.VITE_API_URL,
          "http://localhost:5000",
          "http://localhost:5001",
          "http://localhost:5002",
          "http://localhost:5003",
        ]
    )
      .filter(Boolean)
      .map(normalizeBaseUrl),
  ),
);

export const api = axios.create({
  baseURL: BASE_URLS[0],
});

function switchBaseUrl(nextUrl) {
  api.defaults.baseURL = nextUrl;
}

// Attach JWT to every request.
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
  async (error) => {
    const currentBaseUrl = api.defaults.baseURL;

    const shouldRetry =
      (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") &&
      BASE_URLS.length > 1 &&
      error.config &&
      !error.config.__retried;

    if (shouldRetry) {
      const currentIndex = BASE_URLS.indexOf(currentBaseUrl);
      const nextIndex = (currentIndex + 1) % BASE_URLS.length;
      const nextUrl = BASE_URLS[nextIndex];

      if (nextUrl && nextUrl !== currentBaseUrl) {
        switchBaseUrl(nextUrl);

        error.config.__retried = true;
        error.config.baseURL = nextUrl;

        return api.request(error.config);
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("nebula_token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
