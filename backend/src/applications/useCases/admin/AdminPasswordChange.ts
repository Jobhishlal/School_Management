import { SubAdminRepository } from "../../../domain/repositories/SubAdminCreate";
import { GenarateOtp } from "../../../shared/constants/utils/Otpgenarator";
import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { genarateotptoken } from "../../../infrastructure/security/otpJwtService";
import { IRequestPasswordOtpUseCase } from "../../../domain/UseCaseInterface/IPasswordUpdateUseCase";

export class RequestSubAdminPasswordOtpUseCase  implements IRequestPasswordOtpUseCase{
  constructor(private subAdminRepo: SubAdminRepository) {}

  async execute(email: string) {
    const user = await this.subAdminRepo.findByEmail(email);
    if (!user) throw new Error("SubAdmin not found");

    const otp = GenarateOtp(6);
    await SendEMail(email, "SubAdmin Password Update OTP", `Your OTP is: ${otp}`);
    const otpToken = genarateotptoken(email, otp);

    return { otpToken };
  }
}