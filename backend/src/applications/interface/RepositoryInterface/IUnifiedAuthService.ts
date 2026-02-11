export interface IUnifiedAuthService {
  login(
    email?: string,
    password?: string,
    studentId?: string
  ): Promise<
    | { otpToken: string; role: "super_admin" | "sub_admin" | "Teacher" }
    | { authToken: string; refreshToken: string; role: "Students" | "Parent" }
  >;

  verifyOtp(
    otpToken: string,
    otp: string
  ): Promise<{ authToken: string; refreshToken: string; role: "super_admin" | "sub_admin" | "Teacher" }>;

  resendOtp(oldOtpToken: string): Promise<{ otpToken: string }>;

  refreshToken(token: string): Promise<{ authToken: string; role: string, id: string, email: string }>;
}
