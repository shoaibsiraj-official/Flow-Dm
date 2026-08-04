import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access");

    // Public endpoints par token mat bhejo
    const publicRoutes = [
      "/auth/register/",
      "/auth/login/",
      "/auth/forgot-password/",
      "/auth/reset-password/",
      "/auth/verify-email/",
      "/auth/resend-verification/",
      "/auth/token/refresh/",
    ];

    const isPublic = publicRoutes.some((route) =>
      config.url?.includes(route)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default API;