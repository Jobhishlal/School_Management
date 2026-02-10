
import { ITokenService } from "../../../infrastructure/services/interfaces/ITokenService";
import { OtpError } from "../../../domain/enums/OtpErrorMessage";

import { IVerifyOtpUseCase } from "../../../domain/UseCaseInterface/IVerifyOtpUseCase";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
    constructor(
        private tokenService: ITokenService
    ) { }

    async execute(otpToken: string, otp: string) {
        const decoded = this.tokenService.verifyOtpToken(otpToken);
        if (!decoded) throw new Error(OtpError.OTP_ERROR);
        if (decoded.otp !== otp) throw new Error(OtpError.INVALID_OTP);
        if (!decoded.id || !decoded.email) throw new Error("User identity missing from OTP token");

        const role = decoded.role as "super_admin" | "sub_admin" | "Teacher";

        const authToken = this.tokenService.generateAccessToken({ email: decoded.email, role, id: decoded.id });
        const refreshToken = this.tokenService.generateRefreshToken({ email: decoded.email, role, id: decoded.id });

        console.log("VerifyOtpUseCase: auth token", authToken);
        return { authToken, refreshToken, role, id: decoded.id, email: decoded.email };
    }
}
