import { verifiedOtptoken } from "../../../infrastructure/security/otpJwtService";
import {IVerifySubAdminPasswordOtpUseCase} from '../../../domain/UseCaseInterface/IVerifySubAdminPasswordOtpUseCase'

export class VerifySubAdminPasswordOtpUseCase implements IVerifySubAdminPasswordOtpUseCase{
  async execute(otpToken: string, otp: string) {
    const decoded = verifiedOtptoken(otpToken);
    if (!decoded) throw new Error("Invalid OTP");

    if (decoded.otp !== otp) throw new Error("OTP mismatch");

    return { email: decoded.email }; 
  }
}