// src/api/api.js

export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// Generic API fetch wrapper
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("token");
    window.location.href = "/";
    return;
  }

  // Handle JSON safely
  try {
    return await res.json();
  } catch {
    return null;
  }
}
