import axios from "axios";

export const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem("refresh");
  if (!refreshToken) return;

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
      refresh: refreshToken,
    });

    localStorage.setItem("token", response.data.access);
  } catch (err) {
    console.error("Failed to refresh token:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  }
};
