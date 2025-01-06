import axios from "axios";
import { refreshAuthToken } from "./auth"; // Ensure this is correctly implemented

const API_BASE_URL = "http://127.0.0.1:8000/api/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for response to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the token
        await refreshAuthToken();
        const newToken = localStorage.getItem("token");

        if (newToken) {
          // Set the new token in the header
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
