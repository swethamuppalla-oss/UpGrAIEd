import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5175/api",
});

// 🔐 Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ DEFAULT EXPORT (for API.get style)
export default API;

// ✅ NAMED EXPORTS (for get(), post() style)
export const get = (...args) => API.get(...args);
export const post = (...args) => API.post(...args);
export const put = (...args) => API.put(...args);
export const del = (...args) => API.delete(...args);

// ── Practice / AI functions (imported directly from services/api) ──────────

export const generatePracticeQuestion = async (conceptId, mode = "normal") => {
  try {
    const res = await API.post("/practice/question", { conceptId, mode });
    return res.data;
  } catch {
    return { id: null, question: "Loading question...", options: [], type: "mcq" };
  }
};

export const evaluatePracticeAnswer = async (questionId, answer, mode = "normal") => {
  try {
    const res = await API.post("/practice/evaluate", { questionId, answer, mode });
    return res.data;
  } catch {
    return { correct: false, feedback: "Could not evaluate answer.", score: 0 };
  }
};

export const generateQuestion = async (conceptId) => {
  try {
    const res = await API.post("/practice/question", { conceptId });
    return res.data;
  } catch {
    return { id: null, question: "Loading question...", options: [], type: "mcq" };
  }
};

export const evaluateAnswer = async (questionId, answer) => {
  try {
    const res = await API.post("/practice/evaluate", { questionId, answer });
    return res.data;
  } catch {
    return { correct: false, feedback: "Could not evaluate answer.", score: 0 };
  }
};

export const evaluateLongAnswer = async (data) => {
  try {
    const res = await API.post("/practice/evaluate-long", data);
    return res.data;
  } catch {
    return { score: 0, feedback: "Could not evaluate answer." };
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await API.post("/practice/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch {
    return { url: null, text: "" };
  }
};

export const submitWrittenAnswer = async (data) => {
  try {
    const res = await API.post("/practice/written-answer", data);
    return res.data;
  } catch {
    return { success: false, feedback: "Could not submit answer." };
  }
};
