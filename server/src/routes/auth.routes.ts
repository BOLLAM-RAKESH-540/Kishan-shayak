import { Router } from "express";
import { register, login, getProfile, forgotPasswordOTP, resetPassword, updateProfile, uploadProfileImage, removeProfileImage, deleteAccount } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../config/multer";
import { validate } from "../middlewares/validation.middleware";
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordOtpSchema, 
  resetPasswordSchema 
} from "../utils/auth.schema";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// ✅ FIX 4: Forgot password routes (no auth required)
router.post("/forgot-password-otp", validate(forgotPasswordOtpSchema), forgotPasswordOTP);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, updateProfile);
router.post("/profile-image", authMiddleware, upload.single("image"), uploadProfileImage);
router.delete("/profile-image", authMiddleware, removeProfileImage);
router.delete("/delete-account", authMiddleware, deleteAccount);

export default router;