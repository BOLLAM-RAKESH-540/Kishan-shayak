import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// ✅ FIX 4: In-memory OTP store { phoneNumber -> { otp, expiresAt } }
// NOTE: In production replace this with Redis for persistence across restarts
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// --- REGISTER ---
export const register = async (req: Request, res: Response) => {
  try {
    console.log("👉 Register Body Received:", req.body);

    const { name, password } = req.body;
    
    // Normalize phone number field and ensure it's a string
    const phoneNumber = String(req.body.phoneNumber || req.body.phone || req.body.mobile || "").trim();

    if (!phoneNumber || !password || !name) {
       return res.status(400).json({ message: "Name, Phone, and Password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this phone number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber, 
        passwordHash: hashedPassword, 
      },
    });

    console.log("✅ User created successfully:", user.phoneNumber);
    
    res.status(201).json({ 
      message: "User created successfully", 
      userId: user.id,
      phoneNumber: user.phoneNumber 
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server Error", error: String(error) });
  }
};

// --- LOGIN ---
export const login = async (req: Request, res: Response) => {
  try {
    console.log("👉 Login Request Body:", req.body);

    const phoneNumber = String(req.body.phoneNumber || req.body.phone || req.body.mobile || "").trim();
    const { password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    const user = await prisma.user.findUnique({ 
        where: { phoneNumber } 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials (User not found)" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || "");

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials (Password mismatch)" });
    }

    // 🟢 JWT Payload includes both ID and Phone
    const token = jwt.sign(
      { userId: user.id, phoneNumber: user.phoneNumber }, 
      process.env.JWT_SECRET || "secret", 
      { expiresIn: "24h" }
    );

    console.log("✅ Login successful for:", user.name);

    // 🟢 IMPORTANT: Return phoneNumber clearly so Frontend uses it for Farm/Expense relations
    res.json({ 
        token, 
        user: { 
            id: user.id, 
            name: user.name, 
            phoneNumber: user.phoneNumber 
        } 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// --- GET PROFILE ---
export const getProfile = async (req: Request, res: Response) => {
  try {
    // Middleware should provide either userId or phoneNumber
    const identifier = (req as any).phoneNumber || (req as any).userId; 

    if (!identifier) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: String(identifier) },
          { id: String(identifier) }
        ]
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// ✅ FIX 4: FORGOT PASSWORD — Step 1: Generate & send OTP
export const forgotPasswordOTP = async (req: Request, res: Response) => {
  try {
    const phoneNumber = String(req.body.phoneNumber || "").trim();

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      // Don't reveal whether the number is registered (security best practice)
      return res.status(200).json({ message: "If the number is registered, an OTP has been sent." });
    }

    // Generate a 6-digit OTP, valid for 10 minutes
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min
    otpStore.set(phoneNumber, { otp, expiresAt });

    // 🔔 In production: send via SMS gateway (Twilio, MSG91, etc.)
    // For now, log to console so you can test manually
    console.log(`📱 OTP for ${phoneNumber}: ${otp}  (valid 10 minutes)`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ FIX 4: RESET PASSWORD — Step 2: Verify OTP & set new password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const phoneNumber = String(req.body.phoneNumber || "").trim();
    const { otp, newPassword } = req.body;

    if (!phoneNumber || !otp || !newPassword) {
      return res.status(400).json({ message: "Phone number, OTP, and new password are required" });
    }

    const entry = otpStore.get(phoneNumber);

    if (!entry) {
      return res.status(400).json({ message: "No OTP requested for this number. Please request again." });
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (entry.otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid — hash the new password and update
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { phoneNumber },
      data: { passwordHash },
    });

    // One-time use: delete OTP after successful reset
    otpStore.delete(phoneNumber);

    console.log(`✅ Password reset successfully for ${phoneNumber}`);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};