export interface IUnifiedAuthService {
login(
  email?: string,
  password?: string,
  studentId?: string
): Promise<
  | { otpToken: string; role: "super_admin" | "sub_admin" | "Teacher" }
  | { authToken: string; role: "Students" }
>;


  verifyOtp( otpToken: string, otp: string): Promise<{ authToken: string; role: "super_admin" | "sub_admin" | "Teacher" }>;

  resendOtp(oldOtpToken: string): Promise<{ otpToken: string }>;
}
