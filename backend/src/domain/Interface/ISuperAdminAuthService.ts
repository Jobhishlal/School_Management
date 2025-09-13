export interface ISuperAdminLogin{
 login(email: string, password: string): Promise<boolean>;
  generateOtp(email: string): Promise<string>;
  verifyOtp(otpToken: string, otp: string): Promise<string>;
}