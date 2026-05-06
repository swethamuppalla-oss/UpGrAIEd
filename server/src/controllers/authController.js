import jwt from "jsonwebtoken";

export const demoLogin = async (req, res) => {
  try {
    const token = jwt.sign(
      { id: "demo-user", role: "student" },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("🔥 DEMO LOGIN ERROR:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("🔥 LOGOUT ERROR:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};
