import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Attach token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1NTg0NTM3LCJpYXQiOjE3MzU1ODQyMzcsImp0aSI6ImJjMTNkMDgzZjBiNjRiMGI4MTk4ZGExOWZkYTI4YmQ0IiwidXNlcl9pZCI6Mn0.FSTjXcBlE6Klkqbx07Kk2FGnBJdrBdr5_rAVk-Qrz4U`;
  }
  return config;
});

export default instance;
