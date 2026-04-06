import { Router } from "express";
import { register, login, getProfile, forgotPasswordOTP, resetPassword } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// ✅ FIX 4: Forgot password routes (no auth required)
router.post("/forgot-password-otp", forgotPasswordOTP);
router.post("/reset-password", resetPassword);

// Protected route
router.get("/profile", authMiddleware, getProfile);

export default router;