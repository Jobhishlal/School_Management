import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, AuthUser } from "../types/AuthRequest";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {

    const authHeader = req.headers.authorization;
    // console.log("AuthMiddleware: Header:", authHeader); 
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("AuthMiddleware: No Bearer token");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
      // console.log("AuthMiddleware: Token verified for user:", decoded.id);

      (req as AuthRequest).user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
        classId: decoded.classId,
        studentClassId: decoded.studentClassId
      };

      next();
    } catch (error) {
      console.error("AuthMiddleware: Verification failed:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (err) {
    console.error("AuthMiddleware: Unexpected error", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
