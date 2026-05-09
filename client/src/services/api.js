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

export const get  = (...args) => API.get(...args);
export const post = (...args) => API.post(...args);
export const put  = (...args) => API.put(...args);
export const del  = (...args) => API.delete(...args);

/**
 * Upload an image for OCR / text extraction (used by practice handwriting upload).
 * Sends a FormData payload to /api/practice/extract-text.
 */
export const uploadImage = async (formData) => {
  const res = await API.post("/practice/extract-text", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/**
 * Generate an adaptive practice question for a concept.
 */
export const generateQuestion = async (params) => {
  const res = await API.post("/practice/question", params);
  return res.data;
};

/**
 * Evaluate a typed answer for a practice question.
 */
export const evaluateAnswer = async (params) => {
  const res = await API.post("/practice/evaluate", params);
  return res.data;
};

/**
 * Evaluate a long-form / photo-extracted answer with richer feedback.
 */
export const evaluateLongAnswer = async (params) => {
  const res = await API.post("/practice/evaluate-long", params);
  return res.data;
};

