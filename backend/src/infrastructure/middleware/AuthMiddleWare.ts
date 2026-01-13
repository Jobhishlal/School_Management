import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, AuthUser } from "../types/AuthRequest";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;


    (req as AuthRequest).user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      classId: decoded.classId,
      studentClassId: decoded.studentClassId
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
