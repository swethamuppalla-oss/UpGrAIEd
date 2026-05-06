import API from "./api";

// 🔐 FULL LOGIN
export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  const token = res.data.token;
  localStorage.setItem("token", token);
  return res.data;
};

// 🔐 DEMO LOGIN
export const demoLogin = async () => {
  const res = await API.post("/auth/demo-login");

  const token = res.data.token;

  localStorage.setItem("token", token);

  return token;
};

// 🚪 LOGOUT
export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } catch (err) {
    console.warn("Logout API failed (safe to ignore)");
  }

  localStorage.removeItem("token");
};

// 🧹 CLEAR SESSION
export const clearSession = () => {
  localStorage.removeItem("token");
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

// 📦 GET FULL SESSION (THIS WAS MISSING)
export const getStoredSession = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  return {
    token,
    isAuthenticated: true,
  };
};
