import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 🟢 Updated Interface to include phoneNumber
interface AuthRequest extends Request {
  userId?: string;
  phoneNumber?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from the header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2. Remove "Bearer " prefix
    const token = authHeader.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ FATAL: JWT_SECRET is not set in environment");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // 3. Verify the token 
    // 🟢 Decoded now includes phoneNumber from the login payload
    const decoded = jwt.verify(token, secret) as { 
      userId: string; 
      phoneNumber: string; 
    };
    
    // 4. Attach both to the request object
    (req as any).userId = decoded.userId;
    (req as any).phoneNumber = decoded.phoneNumber;
    
    next(); 
  } catch (error) {
    console.error("🔒 AuthMiddleware: Token verification failed");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};