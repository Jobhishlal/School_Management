import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "super_admin" | "sub_admin" | "Teacher" | "Students";
      };
    }
  }
}
