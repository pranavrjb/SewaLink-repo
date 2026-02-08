import axios from "axios";
import { isAxiosError } from "axios";
// Use relative path for ECS deployment
const API_BASE_URL = /**"/api/v1"  ||**/ "http://localhost:5000/api/v1";
// const API_BASE_URL = "/api/v1" /* || "http://localhost:5000/api/v1" */;
// const API_BASE_URL= "http://192.168.39.66:30005/api/v1"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem("sewalink_user") || sessionStorage.getItem("sewalink_user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      } else {
        console.warn("No token found in localStorage/sessionStorage");
      }
    } catch (err) {
      console.error("Failed to parse user token:", err);
    }
  }
  return config;
});

// Optional: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      console.warn("Unauthorized! Redirect to login page or refresh token.");
      // window.location.href = "/login"; // uncomment if you want auto-redirect
    }
    return Promise.reject(error);
  }
);


export { isAxiosError };

