export interface IVerifySubAdminPasswordOtpUseCase {
  execute(otpToken: string, otp: string): Promise<{ email: string }>;
}
