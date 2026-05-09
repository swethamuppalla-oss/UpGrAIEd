import API from "./api";

// 🔐 FULL LOGIN
export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
  return res.data;
};

// 🔐 DEMO LOGIN
export const demoLogin = async (role = "student") => {
  const res = await API.post("/auth/demo-login", { role });

  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};

// 🚪 LOGOUT
export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } catch (err) {
    console.warn("Logout API failed (safe to ignore)");
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// 🧹 CLEAR SESSION
export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// 🔑 GET TOKEN
export const getAccessToken = () => {
  return localStorage.getItem("token");
};

// 🔒 CHECK TOKEN EXPIRY
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// 📦 GET FULL SESSION
export const getStoredSession = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  let user = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch {
    user = null;
  }

  return { token, user };
};
