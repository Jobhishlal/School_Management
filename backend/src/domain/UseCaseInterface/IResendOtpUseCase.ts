
export interface IResendOtpUseCase {
    execute(oldOtpToken: string): Promise<{ otpToken: string }>;
}
