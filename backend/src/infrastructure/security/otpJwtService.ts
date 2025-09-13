import jwt from "jsonwebtoken";

const OTP_EXPIRES_IN = "2m";
const OTP_SECRET = process.env.JWT_OTP_SECRET || "super-secret-otp";


export function genarateotptoken(email: string, otp: string, extraData?: object) {
  return jwt.sign({ email, otp, ...extraData }, OTP_SECRET, {
    expiresIn: OTP_EXPIRES_IN,
  });
}


export function verifiedOtptoken(token: string) {
  try {
    return jwt.verify(token, OTP_SECRET) as {
      email: string;
      otp: string;
      username?: string;  
      password?: string;  
    };
  } catch {
    return null;
  }
}

export function decodedOtptoken(token: string) {
  try {
    return jwt.decode(token) as { email: string; otp: string } | null;
  } catch {
    return null;
  }
}
