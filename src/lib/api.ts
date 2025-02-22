import axios from "axios";
import { getSession } from "next-auth/react";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Set your API base URL
});

// Add a request interceptor to attach the JWT token to the Authorization header
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.token) {
      config.headers["Authorization"] = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
