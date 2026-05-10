import API from "./api";

// ── Re-exports from sub-services ──────────────────────────────────────────────
export { getContent, updateContent } from "./contentService";

// ── CMS ───────────────────────────────────────────────────────────────────────
export const getCmsSections = async (page) => {
  try {
    const res = await API.get(`/cms/${page}`)
    return res.data.sections || []
  } catch {
    return []
  }
}

export const getCmsAllSections = async (page) => {
  try {
    const res = await API.get(`/cms/${page}/all`)
    return res.data.sections || []
  } catch {
    return []
  }
}

export const updateCmsSection = async (page, section, data) => {
  try {
    const res = await API.put(`/cms/${page}/${section}`, data)
    return res.data
  } catch (err) {
    throw err
  }
}

export const toggleCmsSection = async (page, section, enabled) => {
  try {
    const res = await API.patch(`/cms/${page}/${section}/toggle`, { enabled })
    return res.data
  } catch (err) {
    throw err
  }
}

export const reorderCmsSections = async (page, sections) => {
  try {
    const res = await API.post(`/cms/${page}/reorder`, { sections })
    return res.data
  } catch (err) {
    throw err
  }
}

// Single-field partial update (used by EditableText / EditableButton)
export const saveCmsField = async (page, section, field, value) => {
  try {
    const res = await API.put('/cms/update', { page, section, [field]: value })
    return res.data
  } catch (err) {
    throw err
  }
}

// Admin: page-level section summary (section names, enabled state, order, timestamps)
export const getCmsPageConfig = async (page) => {
  try {
    const res = await API.get(`/cms/${page}/config`)
    return res.data.config || null
  } catch {
    return null
  }
}
export { uploadMedia, getMediaLibrary, getMedia } from "./mediaService";
export { getUIConfig, updateUIConfig } from "./uiConfigService";
export { createUser, getUsers } from "./userService";
export { getStudentDashboard } from "./dashboardService";

// ── ROB / BLOOM SYSTEM ────────────────────────────────────────────────────────
// These power the Bloom companion XP, badges, and quiz features.

export const getROBProgress = async () => {
  try {
    const res = await API.get("/rob/progress");
    return res.data;
  } catch {
    return { level: 1, xp: 0, streak: 0 };
  }
};

export const getROBQuiz = async () => {
  try {
    const res = await API.get("/rob/quiz");
    return res.data;
  } catch {
    return [];
  }
};

export const getRobCompanion = async () => {
  try {
    const res = await API.get("/rob/companion");
    return res.data;
  } catch {
    return { name: "Bloom", mood: "happy", message: "Let's learn something fun today!" };
  }
};

export const saveROBXP = async (xp, level, badges, extra = {}) => {
  try {
    const res = await API.post("/rob/xp", { xp, level, badges, ...extra });
    return res.data;
  } catch {
    return { success: true };
  }
};

export const saveRobCompanionState = async (state) => {
  try {
    const res = await API.post("/rob/companion", state);
    return res.data;
  } catch {
    return { success: true };
  }
};

export const chatWithROB = async (message, context = {}) => {
  try {
    const res = await API.post("/rob/chat", { message, context });
    return res.data;
  } catch {
    return { reply: "I'm thinking... try again in a moment.", suggestions: [] };
  }
};

export const getRobIntelligence = async () => {
  try {
    const res = await API.get("/rob/intelligence");
    return res.data;
  } catch {
    return { interactions: [], quizzes: [], concepts: [], totalSessions: 0 };
  }
};

export const trainROBConcept = async (data) => {
  try {
    const res = await API.post("/rob/train", data);
    return res.data;
  } catch {
    return { success: true };
  }
};

// ── STUDENT PROGRESS ──────────────────────────────────────────────────────────

// Alias kept for backward compatibility with StudentDashboard imports
export const getProgressDashboard = async () => {
  try {
    const res = await API.get("/student/progress");
    return res.data;
  } catch {
    return { success: false, data: null };
  }
};

export const getStudentLevels = async () => {
  try {
    const res = await API.get("/student/levels");
    return res.data;
  } catch {
    return [];
  }
};

export const apiCompleteModule = async (moduleKey, xp, badge) => {
  try {
    const res = await API.post("/student/module/complete", { moduleKey, xp, badge });
    return res.data;
  } catch {
    return { success: true };
  }
};

export const getCurriculum = async () => {
  try {
    const res = await API.get("/student/curriculum");
    return res.data;
  } catch {
    return [];
  }
};

export const getStudentProgress = async () => {
  try {
    const res = await API.get("/student/progress");
    return res.data;
  } catch {
    return {};
  }
};

export const getStudentStats = async () => {
  try {
    const res = await API.get("/student/stats");
    return res.data;
  } catch {
    return {};
  }
};



// ── ADMIN ─────────────────────────────────────────────────────────────────────

export const getAdminStats = async () => {
  try {
    const res = await API.get("/admin/stats");
    return res.data;
  } catch {
    return {};
  }
};

export const getReservations = async () => {
  try {
    const res = await API.get("/admin/reservations");
    return res.data;
  } catch {
    return [];
  }
};

export const approveReservation = async (id) => {
  try {
    const res = await API.post(`/admin/reservations/${id}/approve`);
    return res.data;
  } catch {
    return { success: true };
  }
};

export const getAdminPayments = async () => {
  try {
    const res = await API.get("/admin/payments");
    return res.data;
  } catch {
    return [];
  }
};

export const getAdminUsers = async () => {
  try {
    const res = await API.get("/admin/users");
    return res.data;
  } catch {
    return [];
  }
};

export const blockUser = async (userId) => {
  try {
    const res = await API.post(`/admin/users/${userId}/block`);
    return res.data;
  } catch {
    return { success: true };
  }
};

export const unblockUser = async (userId) => {
  try {
    const res = await API.post(`/admin/users/${userId}/unblock`);
    return res.data;
  } catch {
    return { success: true };
  }
};

export const getConfigByKey = async (key) => {
  try {
    const res = await API.get(`/ui-config/${key}`);
    return res.data;
  } catch {
    return null;
  }
};

export const upsertConfig = async (key, value) => {
  try {
    const res = await API.put(`/ui-config/${key}`, { value });
    return res.data;
  } catch {
    return { success: true };
  }
};

// ── ADMIN VIDEO CMS ────────────────────────────────────────────────────────────

export const getAdminVideos = async () => {
  try {
    const res = await API.get("/admin/videos");
    return res.data;
  } catch {
    return [];
  }
};

export const createAdminVideo = async (data) => {
  try {
    const res = await API.post("/admin/videos", data);
    return res.data;
  } catch {
    return { success: false };
  }
};

export const updateAdminVideo = async (id, data) => {
  try {
    const res = await API.put(`/admin/videos/${id}`, data);
    return res.data;
  } catch {
    return { success: false };
  }
};

export const deleteAdminVideo = async (id) => {
  try {
    const res = await API.delete(`/admin/videos/${id}`);
    return res.data;
  } catch {
    return { success: false };
  }
};

// ── CREATOR ───────────────────────────────────────────────────────────────────

export const getCreatorStats = async () => {
  try {
    const res = await API.get("/creator/stats");
    return res.data;
  } catch {
    return {};
  }
};

export const getCreatorVideos = async () => {
  try {
    const res = await API.get("/creator/videos");
    return res.data;
  } catch {
    return [];
  }
};

export const uploadVideo = async (file, metadata = {}) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(metadata).forEach(([k, v]) => formData.append(k, v));
    const res = await API.post("/creator/videos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch {
    return { success: false };
  }
};

// ── PARENT ────────────────────────────────────────────────────────────────────

export const getChildInfo = async () => {
  try {
    const res = await API.get("/parent/child");
    return res.data;
  } catch {
    return {};
  }
};

export const getChildActivity = async () => {
  try {
    const res = await API.get("/parent/activity");
    return res.data;
  } catch {
    return [];
  }
};

export const getParentBilling = async () => {
  try {
    const res = await API.get("/parent/billing");
    return res.data;
  } catch {
    return {};
  }
};

// ── CHAPTER / LESSON ──────────────────────────────────────────────────────────

export const completeDayLesson = async (planId, dayNumber) => {
  try {
    const res = await API.post("/lessons/complete", { planId, dayNumber });
    return res.data;
  } catch {
    return { success: true };
  }
};

export const getCurrentWeekPlan = async () => {
  try {
    const res = await API.get("/lessons/week-plan/current");
    return res.data;
  } catch {
    return null;
  }
};

export const getWeekPlan = async (planId) => {
  try {
    const res = await API.get(`/lessons/week-plan/${planId}`);
    return res.data;
  } catch {
    return null;
  }
};

export const approveWeekPlan = async (planId) => {
  try {
    const res = await API.post(`/lessons/week-plan/${planId}/approve`);
    return res.data;
  } catch {
    return { success: true };
  }
};

export const uploadChapterPhotos = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((f) => formData.append("photos", f));
    const res = await API.post("/chapters/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch {
    return { success: true };
  }
};

export const getChapterStatus = async (id) => {
  try {
    const res = await API.get(`/chapters/${id}/status`);
    return res.data;
  } catch {
    return {};
  }
};

export const submitWeeklyExam = async (planId, answers) => {
  try {
    const res = await API.post("/exams/submit", { planId, answers });
    return res.data;
  } catch {
    return { score: 0, passed: false };
  }
};

// ── PAYMENT ───────────────────────────────────────────────────────────────────

export const getPaymentStatus = async () => {
  try {
    const res = await API.get("/payment/status");
    return res.data;
  } catch {
    return { status: "pending" };
  }
};

export const createPaymentOrder = async (data) => {
  try {
    const res = await API.post("/payment/order", data);
    return res.data;
  } catch {
    return {};
  }
};

export const verifyPayment = async (data) => {
  try {
    const res = await API.post("/payment/verify", data);
    return res.data;
  } catch {
    return { success: false };
  }
};

// ── RESERVATION ───────────────────────────────────────────────────────────────

export const createReservation = async (data) => {
  try {
    const res = await API.post("/reservations", data);
    return res.data;
  } catch {
    return { success: true };
  }
};

// ── VIDEO / STREAM ────────────────────────────────────────────────────────────

export const getStreamUrl = async (moduleId) => {
  try {
    const res = await API.get(`/videos/${moduleId}/stream-url`);
    return res.data;
  } catch {
    return null;
  }
};

export const postProgress = async (moduleId, data) => {
  try {
    const res = await API.post(`/content/progress/${moduleId}`, data);
    return res.data;
  } catch {
    return { success: true };
  }
};
