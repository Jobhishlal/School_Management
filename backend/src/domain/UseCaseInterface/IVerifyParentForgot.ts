export interface IVerifyPasswordOtpUseCase {
  execute(otpToken: string, otp: string): Promise<{ email: string; role?: string; id?: string }>;
}
