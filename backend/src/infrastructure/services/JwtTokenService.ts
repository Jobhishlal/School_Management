
import jwt from "jsonwebtoken";
import { ITokenService } from "../../applications/interfaces/ITokenService";
import { genarateotptoken, verifiedOtptoken, decodedOtptoken } from "../security/otpJwtService";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super-refresh-secret";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export class JwtTokenService implements ITokenService {
    generateAccessToken(payload: any): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    }

    generateRefreshToken(payload: any): string {
        return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
    }

    verifyRefreshToken(token: string): any {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    }

    generateOtpToken(payload: any, otp: string): string {
        // Using existing helper but wrapping it standardly
        // Assuming payload needs email. The original genarateotptoken takes email, otp, payload.
        // Let's reuse the existing function logic but adapt.
        // Actually, to keep it clean, let's call the existing helper for now to avoid breaking changes in OTP structure.
        return genarateotptoken(payload.email, otp, payload);
    }

    verifyOtpToken(token: string): any {
        return verifiedOtptoken(token);
    }

    decodeToken(token: string): any {
        return decodedOtptoken(token);
    }
}
