import express from "express";
import { demoLogin, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/demo-login", demoLogin);
router.post("/logout", logout);

export default router;
