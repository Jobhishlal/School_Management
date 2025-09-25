export interface IUnifiedAuthService {
  login(  email: string,  password: string): Promise<{ otpToken: string; role: "super_admin" | "sub_admin" | "Teacher"}>;

  verifyOtp( otpToken: string, otp: string): Promise<{ authToken: string; role: "super_admin" | "sub_admin" | "Teacher" }>;

  resendOtp(oldOtpToken: string): Promise<{ otpToken: string }>;
}
