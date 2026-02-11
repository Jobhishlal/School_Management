import { IParentRepositorySign } from "../../../domain/repositories/Auth/IParentRepository";
import { GenarateOtp } from "../../../shared/constants/utils/Otpgenarator";
import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { genarateotptoken } from "../../../infrastructure/security/otpJwtService";
import { IRequestPasswordOtpUseCase } from "../../interface/UseCaseInterface/IPasswordUpdateUseCase";

export class RequestParentPasswordOtpUseCase implements IRequestPasswordOtpUseCase {
  constructor(private parentRepo: IParentRepositorySign) {}

  async execute(email: string) {

    const user = await this.parentRepo.findByEmail(email);
    if (!user) throw new Error("Parent not found");


    const otp = GenarateOtp(6);
    console.log("otp",otp)

    await SendEMail(email, "Parent Password Reset OTP", `Your OTP is: ${otp}`);

    const otpToken = genarateotptoken(email, otp, { role: "Parent", id: user.id });

    return { otpToken };
  }
}
