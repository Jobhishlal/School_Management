
export interface IVerifyOtpUseCase {
    execute(otpToken: string, otp: string): Promise<{
        authToken: string;
        refreshToken: string;
        role: "super_admin" | "sub_admin" | "Teacher";
        id: string;
        email: string;
    }>;
}
