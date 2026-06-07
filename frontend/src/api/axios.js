import axios from "axios";

import {
  getAccessToken,
} from "./tokenmanager";

const api = axios.create({
  baseURL:
    "http://localhost:3000/api",

  withCredentials: true,

  headers: {
    "Content-Type":
      "application/json",
  },
});

api.interceptors.request.use(
  (config) => {

    const token =
      getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export default api;