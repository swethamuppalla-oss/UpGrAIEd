import jwt from "jsonwebtoken";

export const demoLogin = async (req, res) => {
  try {
    const role = req.body.role || "student";
    const user = {
      id: `demo-${role}`,
      role: role,
      name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`
    };

    const token = jwt.sign(
      user,
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (err) {
    console.error("🔥 DEMO LOGIN ERROR:", err);
    return res.status(500).json({ error: "Login failed" });
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
