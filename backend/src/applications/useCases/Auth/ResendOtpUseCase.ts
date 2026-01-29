
import { ITokenService } from "../../interfaces/ITokenService";
import { IEmailService } from "../../interfaces/IEmailService";
import { OtpError } from "../../../domain/enums/OtpErrorMessage";
import { GenarateOtp } from "../../../shared/constants/utils/Otpgenarator";

import { IResendOtpUseCase } from "../../../domain/UseCaseInterface/IResendOtpUseCase";

export class ResendOtpUseCase implements IResendOtpUseCase {
    constructor(
        private tokenService: ITokenService,
        private emailService: IEmailService
    ) { }

    async execute(oldOtpToken: string) {
        const decoded = this.tokenService.decodeToken(oldOtpToken);
        if (!decoded || !decoded.email) throw new Error(OtpError.INVALID_OTP);

        const newOtp = GenarateOtp(6);
        await this.emailService.send(decoded.email, "Resend OTP", `Your new OTP is: ${newOtp}`);

        const newOtpToken = this.tokenService.generateOtpToken({ role: decoded.role, id: decoded.id, email: decoded.email }, newOtp);
        return { otpToken: newOtpToken };
    }
}
