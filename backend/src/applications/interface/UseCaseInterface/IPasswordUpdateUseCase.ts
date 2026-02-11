
export interface IRequestPasswordOtpUseCase {
  execute(email: string): Promise<{ otpToken: string }>;
}
