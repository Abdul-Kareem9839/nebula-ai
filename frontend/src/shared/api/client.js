import axios from "axios";

const DEFAULT_BASE_URLS = [
  import.meta.env.VITE_API_URL,
  "http://localhost:5000/api",
  "http://localhost:5001/api",
  "http://localhost:5002/api",
  "http://localhost:5003/api",
].filter(Boolean);

function getBaseUrls() {
  return Array.from(new Set(DEFAULT_BASE_URLS));
}

export const api = axios.create({
  baseURL: getBaseUrls()[0],
});

let activeBaseUrlIndex = 0;

function setBaseUrl(nextUrl) {
  api.defaults.baseURL = nextUrl;
  activeBaseUrlIndex = getBaseUrls().indexOf(nextUrl);
}

// Attach the JWT to every request once the user's logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nebula_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Central 401 handling — bounce to login instead of every caller checking status.
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const urls = getBaseUrls();
    const currentBaseUrl = api.defaults.baseURL;
    const shouldRetry =
      (err.code === "ERR_NETWORK" ||
        err.code === "ECONNABORTED" ||
        err.response?.status === 404) &&
      urls.length > 1 &&
      err.config?.url;

    if (shouldRetry) {
      const nextIndex = (urls.indexOf(currentBaseUrl) + 1) % urls.length;
      const nextUrl = urls[nextIndex];

      if (nextUrl && nextUrl !== currentBaseUrl) {
        setBaseUrl(nextUrl);
        err.config.baseURL = nextUrl;
        return api.request(err.config);
      }
    }

    if (err.response?.status === 401) {
      localStorage.removeItem("nebula_token");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  },
);
