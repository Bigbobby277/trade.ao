// In local dev this stays "/api" and Vite proxies it to localhost:4000 (see vite.config.js).
// In production, set VITE_API_URL to your deployed backend, e.g. https://trader-ai-backend.onrender.com/api
const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  newsPreview: () => request("/news/preview"),
  news: () => request("/news"),
  checkout: (plan) => request("/subscription/checkout", { method: "POST", body: JSON.stringify({ plan }) }),
};
