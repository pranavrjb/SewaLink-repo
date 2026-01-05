import axios from "axios";

<<<<<<< HEAD
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://backend:5000/api/v1";
=======
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL /**|| "http://localhost:5000/api/v1"**/;
>>>>>>> 8f2292916b7bb49a99a6e50b9ad1641768c61c8a

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
      }
    } catch {
    }
  }
  return config;
});

export { isAxiosError } from "axios";
