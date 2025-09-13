import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ISuperAdminLogin } from "../../domain/Interface/ISuperAdminAuthService";
import { SendEMail } from "./EmailService";
import { genarateotptoken, verifiedOtptoken, decodedOtptoken } from "../security/otpJwtService";
import { GenarateOtp } from "../utils/Otpgenarator";

const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL!;
const MAIN_ADMIN_PASS = process.env.MAIN_ADMIN_PASSWORD_HASH!;
const JWT_SECRET = process.env.JWT_SECRET!;

export class SuperAdminAuthService implements ISuperAdminLogin {
  async login(email: string, password: string): Promise<boolean> {
    if (email !== MAIN_ADMIN_EMAIL) return false;

    const isMatch = await bcrypt.compare(password, MAIN_ADMIN_PASS);
    return isMatch;
  }

  async generateOtp(email: string): Promise<string> {
    const otp = GenarateOtp(6);
    await SendEMail(email, "SuperAdmin OTP", `Your OTP is: ${otp}`);
    return genarateotptoken(email, otp);
  }

  async resendOtp(oldOtpToken: string): Promise<string> {
    const decoded = decodedOtptoken(oldOtpToken); 
    if (!decoded || !decoded.email) {
      throw new Error("Invalid old OTP token");
    }

    const newOtp = GenarateOtp(6);
    await SendEMail(decoded.email, "Resend SuperAdmin OTP", `Your new OTP is: ${newOtp}`);
    return genarateotptoken(decoded.email, newOtp);
  }

  async verifyOtp(otpToken: string, otp: string): Promise<string> {
    const decoded = verifiedOtptoken(otpToken); 
    if (!decoded || decoded.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    return jwt.sign({ email: decoded.email }, JWT_SECRET, { expiresIn: "1h" });
  }
}
