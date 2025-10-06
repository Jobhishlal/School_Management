import {IParentRepositorySign} from '../../../domain/repositories/Auth/IParentRepository'
import { verifiedOtptoken } from '../../../infrastructure/security/otpJwtService'
import { IVerifyPasswordOtpUseCase } from '../../../domain/UseCaseInterface/IVerifyParentForgot'


export class VerifyParentPasswordOtpUseCase implements IVerifyPasswordOtpUseCase {
  async execute(otpToken: string, otp: string) {
    const decoded = verifiedOtptoken(otpToken); 
    if (!decoded) throw new Error("Invalid OTP");
    if (decoded.otp !== otp) throw new Error("OTP mismatch");
    
    return { email: decoded.email, role: "Parent", id: decoded.id };
  }
}
