import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import redis from "../config/redis";
import { CustomError } from "../middlewares/error.middleware";

const OTP_EXPIRY = 600; // 10 minutes

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: any) {
    const { name, password } = data;
    const phoneNumber = String(data.phoneNumber || data.phone || data.mobile || "").trim();

    if (!phoneNumber || !password || !name) {
      throw new CustomError("Name, Phone, and Password are required", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingUser) {
      throw new CustomError("User already exists with this phone number", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        passwordHash: hashedPassword,
      },
    });

    return {
      userId: user.id,
      phoneNumber: user.phoneNumber,
    };
  }

  /**
   * Login user and generate JWT
   */
  static async login(data: any) {
    const phoneNumber = String(data.phoneNumber || data.phone || data.mobile || "").trim();
    const { password } = data;

    if (!phoneNumber || !password) {
      throw new CustomError("Phone number and password are required", 400);
    }

    const user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    const genericErrorMessage = "Invalid phone number or password";

    if (!user) {
      throw new CustomError(genericErrorMessage, 400);
    }

    // Check account lock
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      throw new CustomError(
        `Account is temporarily locked. Try again in ${remainingMinutes} minutes.`,
        403
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || "");

    if (!isMatch) {
      const newFailedAttempts = (user.failedAttempts || 0) + 1;
      const MAX_ATTEMPTS = 5;
      let lockUntil = user.lockUntil;

      if (newFailedAttempts >= MAX_ATTEMPTS) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: newFailedAttempts, lockUntil },
      });

      throw new CustomError(genericErrorMessage, 400);
    }

    // Success - Reset security metadata
    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockUntil: null, lastLoginAt: new Date() },
    });

    if (!process.env.JWT_SECRET) {
      throw new CustomError("Server configuration error (JWT_SECRET)", 500);
    }

    const token = jwt.sign(
      { userId: user.id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    };
  }

  /**
   * Handle Forgot Password OTP generation
   */
  static async generateForgotPasswordOTP(phoneNumber: string) {
    if (!phoneNumber) {
      throw new CustomError("Phone number is required", 400);
    }

    const user = await prisma.user.findUnique({ where: { phoneNumber: phoneNumber.trim() } });
    if (!user) {
      // Return success to avoid user enumeration
      return { message: "If the number is registered, an OTP has been sent." };
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await redis.setex(`otp:${user.phoneNumber}`, OTP_EXPIRY, otp);

    // In production, send via SMS gateway. For now, log to console.
    console.log(`📱 OTP for ${user.phoneNumber}: ${otp} (valid 10 minutes)`);

    return { message: "OTP sent successfully" };
  }

  /**
   * Reset password using OTP
   */
  static async resetPassword(data: any) {
    const phoneNumber = String(data.phoneNumber || "").trim();
    const { otp, newPassword } = data;

    if (!phoneNumber || !otp || !newPassword) {
      throw new CustomError("Phone number, OTP, and new password are required", 400);
    }

    const storedOtp = await redis.get(`otp:${phoneNumber}`);
    if (!storedOtp || storedOtp !== String(otp)) {
      throw new CustomError("Invalid or expired OTP", 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { phoneNumber },
      data: { passwordHash },
    });

    await redis.del(`otp:${phoneNumber}`);

    return { message: "Password updated successfully" };
  }

  /**
   * Get User Profile
   */
  static async getProfile(identifier: string) {
    if (!identifier) {
      throw new CustomError("Unauthorized", 401);
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
      throw new CustomError("User not found", 404);
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update User Profile
   */
  static async updateProfile(phoneNumber: string, data: any) {
    if (!phoneNumber) {
      throw new CustomError("Unauthorized", 401);
    }

    const { name, location, bio, totalLand, experienceYears } = data;

    const updatedUser = await prisma.user.update({
      where: { phoneNumber },
      data: {
        name,
        location,
        bio,
        totalLand: totalLand ? parseFloat(totalLand) : undefined,
        experienceYears: experienceYears ? parseInt(experienceYears) : undefined
      },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Update Profile Image
   */
  static async updateProfileImage(phoneNumber: string, imagePath: string) {
    if (!phoneNumber) {
      throw new CustomError("Unauthorized", 401);
    }

    await prisma.user.update({
      where: { phoneNumber },
      data: { profileImage: imagePath },
    });

    return imagePath;
  }

  /**
   * Delete User Account (Crucial for Legal/Professional Standards)
   * This performs a cascading cleanup of all user records.
   */
  static async deleteAccount(phoneNumber: string) {
    if (!phoneNumber) {
      throw new CustomError("Unauthorized", 401);
    }

    // Since we use the phoneNumber as the foreign key in many places:
    // 1. Delete user's farm profiles (and their cascading activities/yields if configured in DB)
    // Actually, in many cases, we need to explicitly delete children if not set to cascade.
    
    // Deleting all related records to ensure no orphaned data
    await prisma.$transaction([
      prisma.expense.deleteMany({ where: { userId: phoneNumber } }),
      prisma.communityComment.deleteMany({ where: { userId: phoneNumber } }),
      prisma.communityPost.deleteMany({ where: { userId: phoneNumber } }),
      prisma.fieldActivity.deleteMany({
        where: { farm: { userId: phoneNumber } }
      }),
      prisma.yieldLog.deleteMany({
        where: { farm: { userId: phoneNumber } }
      }),
      prisma.farmProfile.deleteMany({ where: { userId: phoneNumber } }),
      prisma.user.delete({ where: { phoneNumber } })
    ]);

    return { message: "Account and all associated data deleted successfully. We're sorry to see you go. 🌾" };
  }
}
