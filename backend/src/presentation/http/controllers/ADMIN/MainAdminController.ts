import { Request, Response } from "express";
import { LoginSuperAdmin } from "../../../../applications/useCases/LoginSuperAdmin";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { ISuperAdminLogin } from "../../../../domain/Interface/ISuperAdminAuthService";
import { ResendOtp } from "../../../../applications/useCases/ResenOtp";
import {OtpError} from '../../../../domain/enums/OtpErrorMessage'


export class SuperAdminController {
  constructor(
    private loginUseCase: LoginSuperAdmin,
    private authService: ISuperAdminLogin,
    private resendotpUseCase:ResendOtp,
  ) {}


  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const otpToken = await this.loginUseCase.execute(email, password);

      res.status(StatusCodes.OK).json({
        message: OtpError.OTP_SENT,
        otpToken,
      });
    } catch (error: any) {
     
      res.status(StatusCodes.UNAUTHORIZED).json({ message: OtpError.INVALID_OTP});
    }
  }


  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { otpToken, otp } = req.body;
      const finalJwt = await this.authService.verifyOtp(otpToken, otp);

      res.status(StatusCodes.OK).json({
        message: OtpError.SUCCESS,
        token: finalJwt,
      });
    } catch (error: any) {
      console.error("OTP error:", error.message);
      res.status(StatusCodes.BAD_REQUEST).json({ message:OtpError.INVALID_OTP});
    }
  }


async resendOtp(req: Request, res: Response): Promise<void> {
  try {
    const { oldOtpToken } = req.body;
    const { otpToken } = await this.resendotpUseCase.execute(oldOtpToken); 

    res.status(StatusCodes.OK).json({
      message: OtpError.RESEND_OTP,
      otpToken, 
    });
  } catch (error: any) {
    console.error("Resend OTP error:", error.message);
    res.status(StatusCodes.BAD_REQUEST).json({ message: OtpError.OTP_ERROR});
  }
}

}
