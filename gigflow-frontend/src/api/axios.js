import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
console.log("🚀 GigFlow API connected to:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true
});

export default api;
