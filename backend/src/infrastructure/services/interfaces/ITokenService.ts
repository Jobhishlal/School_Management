
export interface ITokenService {
    generateAccessToken(payload: ReturnType<typeof JSON.parse>): string;
    generateRefreshToken(payload: ReturnType<typeof JSON.parse>): string;
    verifyRefreshToken(token: string): ReturnType<typeof JSON.parse>;
    generateOtpToken(payload: ReturnType<typeof JSON.parse>, otp: string): string;
    verifyOtpToken(token: string): ReturnType<typeof JSON.parse>;
    decodeToken(token: string): ReturnType<typeof JSON.parse>;
}
