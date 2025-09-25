
import { Request, Response } from "express";
import { UnifiedAdminAuthService } from "../../../../infrastructure/providers/SuperAdminAuthService";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { OtpError } from "../../../../domain/enums/OtpErrorMessage";
import logger from "../../../../shared/constants/Logger";
import { AdminError } from "../../../../domain/enums/Adminsinguperror";

export class AdminLoginController {
  constructor(private authService: UnifiedAdminAuthService) {}

  
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      logger.info(JSON.stringify(req.body))
      const result = await this.authService.login(email, password);
      logger.info(JSON.stringify(result))

      res.status(StatusCodes.OK).json({
        type: result.role,
        message: OtpError.OTP_SENT,
        otpToken: result.otpToken,
      });
    } catch (error: any) {
      logger.info(error.message)
      if (error.message === "Invalid Teacher Credentials") {
      res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid email or password" });
      return
    }  

     if (error.message === "teacher blocked") {
    res.status(StatusCodes.FORBIDDEN)
       .json({ message: "Teacher is blocked, please contact your admin" });
    return;
  }

  if (error.message === "subadmin blocked") {
    res.status(StatusCodes.FORBIDDEN)
       .json({ message: "Sub Admin is blocked, please contact school management" });
    return;
  }

      if (error.message === "UserDoesNotExist") {
        console.log(error.message)
       res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User does not exist" });
      return
     }
    console.log(error)
       res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: AdminError.UserDoesNotExist });
    return

    
}
    }
  

  
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { otpToken, otp } = req.body;
      const { authToken, role } = await this.authService.verifyOtp(otpToken, otp);

      res.status(StatusCodes.OK).json({
        message: OtpError.SUCCESS,
        authToken,
        role,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }


  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { oldOtpToken } = req.body;
      const { otpToken } = await this.authService.resendOtp(oldOtpToken);

      res.status(StatusCodes.OK).json({
        message: OtpError.RESEND_OTP,
        otpToken,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
}
