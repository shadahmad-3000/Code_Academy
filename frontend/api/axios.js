import axios from "axios";
import { API_URL } from "@/config.js";

const instance  = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add an interceptor to include the token in the Authorization header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
