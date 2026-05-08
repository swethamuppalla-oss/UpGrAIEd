import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

export const get = (...args) => API.get(...args);
export const post = (...args) => API.post(...args);
export const put = (...args) => API.put(...args);
export const del = (...args) => API.delete(...args);
