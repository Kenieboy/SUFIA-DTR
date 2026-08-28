import express from "express";

import { login, profile, logout } from "../controllers/authController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/logout", logout);

router.get("/profile", authenticate, profile);

export default router;
