import axios from "axios";
import config from "./config"; // Import base URL
import AuthContext from "./context/AuthContext"; // Import AuthContext
import { useContext } from "react";

console.log(config)
// ✅ API instance with base URL
const api = axios.create({
  baseURL: config.API_BASE_URL,
});

// ✅ Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor - Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    const refreshToken = localStorage.getItem("refreshToken");

    if (response?.status === 401 && refreshToken) {
      try {
        // Refresh token
        const { refreshAccessToken } = useContext(AuthContext);
        const newAccessToken = await refreshAccessToken(refreshToken);

        // Retry original request with new token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        localStorage.clear();
        window.location.href = "/login"; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;
