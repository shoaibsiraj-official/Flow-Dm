import API from "./api";

export const authAPI = {
  register: (data) =>
    API.post("/auth/register/", data),

  login: (data) =>
    API.post("/auth/login/", data),

  logout: (refresh) =>
    API.post("/auth/logout/", {
      refresh,
    }),

  refresh: (refresh) =>
    API.post("/auth/token/refresh/", {
      refresh,
    }),

  me: () =>
    API.get("/auth/me/"),

  forgotPassword: (email) =>
    API.post("/auth/forgot-password/", {
      email,
    }),

  resetPassword: (data) =>
    API.post("/auth/reset-password/", data),

  verifyEmail: (token) =>
    API.post("/auth/verify-email/", {
      token,
    }),
};