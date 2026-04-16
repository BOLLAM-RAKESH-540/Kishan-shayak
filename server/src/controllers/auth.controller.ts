import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

/**
 * Auth Controller handles HTTP concerns and delegates business logic to AuthService.
 * Error handling is centralized via errorMiddleware.
 */

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({ message: "User created successfully", ...result });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const identifier = (req as any).phoneNumber || (req as any).userId;
    const profile = await AuthService.getProfile(identifier);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const phoneNumber = String(req.body.phoneNumber || "").trim();
    const result = await AuthService.generateForgotPasswordOTP(phoneNumber);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.resetPassword(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const phoneNumber = (req as any).phoneNumber;
    const profile = await AuthService.updateProfile(phoneNumber, req.body);
    res.json({ message: "Profile updated successfully ✅", user: profile });
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const phoneNumber = (req as any).phoneNumber;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = file.path.replace(/\\/g, '/');
    const updatedPath = await AuthService.updateProfileImage(phoneNumber, imagePath);

    res.json({
      message: "Image uploaded successfully ✅",
      profileImage: updatedPath
    });
  } catch (error) {
    next(error);
  }
};

export const removeProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const phoneNumber = (req as any).phoneNumber;
    await AuthService.updateProfileImage(phoneNumber, null as any); // Reusing service method
    res.json({
      message: "Profile image removed successfully ✅",
      profileImage: null
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const phoneNumber = (req as any).phoneNumber;
    const result = await AuthService.deleteAccount(phoneNumber);
    res.json(result);
  } catch (error) {
    next(error);
  }
};