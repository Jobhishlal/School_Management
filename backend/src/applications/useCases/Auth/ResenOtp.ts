import { SendEMail } from "../../../infrastructure/providers/EmailService";
import { genarateotptoken, verifiedOtptoken } from "../../../infrastructure/security/otpJwtService";
import { GenarateOtp } from "../../../shared/constants/utils/Otpgenarator";
import { AdminError } from "../../../domain/enums/Adminsinguperror";

export class ResendOtp {
  async execute(oldOtpToken: string) {
    const decoded = verifiedOtptoken(oldOtpToken);

    console.log("Decoded oldOtpToken:", decoded);

    if (!decoded) {
      throw new Error(AdminError.Invalid_otp);
    }

    const { email } = decoded;

    if (!email) {
      throw new Error("Email is missing in OTP token, cannot resend OTP");
    }

    const otp = GenarateOtp(6);

  
    await SendEMail(email, "Resend OTP", `Your new OTP is: ${otp}`);

 
    const newOtpToken = genarateotptoken(email, otp);

    return { otpToken: newOtpToken };
  }
}
