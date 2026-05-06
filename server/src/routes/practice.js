import express from "express";
import {
  generateQuestion,
  evaluateAnswer
} from "../controllers/practiceController.js";

const router = express.Router();

router.post("/generate", generateQuestion);
router.post("/evaluate", evaluateAnswer);

export default router;
