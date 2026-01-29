
export interface ITokenService {
    generateAccessToken(payload: any): string;
    generateRefreshToken(payload: any): string;
    verifyRefreshToken(token: string): any;
    generateOtpToken(payload: any, otp: string): string;
    verifyOtpToken(token: string): any;
    decodeToken(token: string): any;
}
