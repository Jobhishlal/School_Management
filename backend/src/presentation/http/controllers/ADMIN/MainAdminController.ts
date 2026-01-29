
import { Request, Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { OtpError } from "../../../../domain/enums/OtpErrorMessage";
import logger from "../../../../shared/constants/Logger";
import { AdminError } from "../../../../domain/enums/Adminsinguperror";
import { IUnifiedLoginUseCase } from "../../../../domain/UseCaseInterface/IUnifiedLoginUseCase";
import { IVerifyOtpUseCase } from "../../../../domain/UseCaseInterface/IVerifyOtpUseCase";
import { IRefreshTokenUseCase } from "../../../../domain/UseCaseInterface/IRefreshTokenUseCase";
import { IResendOtpUseCase } from "../../../../domain/UseCaseInterface/IResendOtpUseCase";

export class AdminLoginController {
  constructor(
    private loginUseCase: IUnifiedLoginUseCase,
    private verifyOtpUseCase: IVerifyOtpUseCase,
    private refreshTokenUseCase: IRefreshTokenUseCase,
    private resendOtpUseCase: IResendOtpUseCase
  ) { }


  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("reached only controller")
      const { email, password, studentId } = req.body;

      logger.info(JSON.stringify(req.body));

      const result: any = await this.loginUseCase.execute(email, password, studentId);
      logger.info(JSON.stringify(result));


      if ("otpToken" in result) {
        res.status(StatusCodes.OK).json({
          role: result.role,
          message: OtpError.OTP_SENT,
          otpToken: result.otpToken,
        });
        return;
      }

      if ("authToken" in result) {
        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(StatusCodes.OK).json({
          role: result.role,
          message: "Login successful",
          authToken: result.authToken,
        });
        return;
      }
    } catch (error: any) {
      logger.info(error.message);

      if (error.message === "Invalid Teacher Credentials") {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" });
        return;
      }

      if (error.message === "teacher blocked") {
        res.status(StatusCodes.FORBIDDEN).json({
          message: "Teacher is blocked, please contact your admin",
        });
        return;
      }

      if (error.message === "subadmin blocked") {
        res.status(StatusCodes.FORBIDDEN).json({
          message: "Sub Admin is blocked, please contact school management",
        });
        return;
      }

      if (error.message === "UserDoesNotExist") {
        console.log("user doesnot exist",)

        res.status(StatusCodes.NOT_FOUND).json({ message: "User does not exist" });
        return;
      }


      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: AdminError.UserDoesNotExist,
      });
    }
  }



  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { otpToken, otp } = req.body;
      console.log("token", req.body);


      const { authToken, refreshToken, role, id, email } = await this.verifyOtpUseCase.execute(otpToken, otp);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      res.status(StatusCodes.OK).json({
        message: OtpError.SUCCESS,
        authToken,
        role,
        id,
        email,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }



  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { oldOtpToken } = req.body;
      const { otpToken } = await this.resendOtpUseCase.execute(oldOtpToken);

      res.status(StatusCodes.OK).json({
        message: OtpError.RESEND_OTP,
        otpToken,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Refresh token missing" });
        return;
      }

      const result = await this.refreshTokenUseCase.execute(refreshToken);

      res.status(StatusCodes.OK).json({
        success: true,
        accessToken: result.authToken,
        role: result.role
      });
    } catch (error: any) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid refresh token" });
    }
  }
}

