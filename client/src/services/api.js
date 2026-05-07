import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5175/api"
});

export default API;

export const get = (...args) => API.get(...args);
export const post = (...args) => API.post(...args);
export const put = (...args) => API.put(...args);
export const del = (...args) => API.delete(...args);
