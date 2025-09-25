import jwt from "jsonwebtoken";

const OTP_EXPIRES_IN = "2m";
const OTP_SECRET = process.env.JWT_OTP_SECRET || "super-secret-otp";

export interface OtpPayload {
  email: string;
  otp: string;
  role?: "super" | "sub" | "teacher"; 
  id?: string;            
  username?: string;
  password?: string;
}

export function genarateotptoken(email: string, otp: string, extraData?: object) {
  return jwt.sign({ email, otp, ...extraData }, OTP_SECRET, {
    expiresIn: OTP_EXPIRES_IN,
  });
}

export function verifiedOtptoken(token: string): OtpPayload | null {
  try {
    return jwt.verify(token, OTP_SECRET) as OtpPayload;
  } catch {
    return null;
  }
}

export function decodedOtptoken(token: string): OtpPayload | null {
  try {
    return jwt.decode(token) as OtpPayload | null;
  } catch {
    return null;
  }
}
