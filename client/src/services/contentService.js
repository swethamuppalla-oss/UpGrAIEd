import { contentData } from "../constants/contentData";

const API = import.meta.env.VITE_API_URL || '';

export const getContent = async (section) => {
  try {
    const res = await fetch(`${API}/api/content/${section}`);
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch (error) {
    console.warn("Using fallback content for:", section);
    return contentData[section];
  }
};
