import API from "./api";

export const instagramAPI = {
  loginURL() {
    return API.get("/instagram/login-url/");
  },

  getAccounts() {
    return API.get("/instagram/accounts/");
  },
};