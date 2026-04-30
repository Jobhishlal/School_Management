import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";

import { Request, Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { OtpError } from "../../../../domain/enums/OtpErrorMessage";
import logger from "../../../../shared/constants/Logger";
import { AdminError } from "../../../../domain/enums/Adminsinguperror";
import { IUnifiedLoginUseCase } from "../../../../applications/interface/UseCaseInterface/IUnifiedLoginUseCase";
import { IVerifyOtpUseCase } from "../../../../applications/interface/UseCaseInterface/IVerifyOtpUseCase";
import { IRefreshTokenUseCase } from "../../../../applications/interface/UseCaseInterface/IRefreshTokenUseCase";
import { IResendOtpUseCase } from "../../../../applications/interface/UseCaseInterface/IResendOtpUseCase";

export class AdminLoginController {
  constructor(
    private _loginUseCase: IUnifiedLoginUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _refreshTokenUseCase: IRefreshTokenUseCase,
    private _resendOtpUseCase: IResendOtpUseCase
  ) { }


  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("reached only controller")
      const { email, password, studentId } = req.body;

      logger.info(JSON.stringify(req.body));

      const result: ReturnType<typeof JSON.parse> = await this._loginUseCase.execute(email, password, studentId);
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
          message: RESPONSE_MESSAGES.LOGIN_SUCCESSFUL,
          authToken: result.authToken,
        });
        return;
      }
    } catch (error: unknown) {
      logger.info((error as Error).message);

      if ((error as Error).message === "Invalid Teacher Credentials") {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.INVALID_EMAIL_OR_PASSWORD });
        return;
      }

      if ((error as Error).message === "teacher blocked") {
        res.status(StatusCodes.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.TEACHER_IS_BLOCKED_PLEASE_CONTACT_YOUR_ADMIN,
        });
        return;
      }

      if ((error as Error).message === "subadmin blocked") {
        res.status(StatusCodes.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.SUB_ADMIN_IS_BLOCKED_PLEASE_CONTACT_SCHOOL_MANAGEM,
        });
        return;
      }

      if ((error as Error).message === "UserDoesNotExist") {
        console.log("user doesnot exist",)

        res.status(StatusCodes.NOT_FOUND).json({ message: RESPONSE_MESSAGES.USER_DOES_NOT_EXIST });
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


      const { authToken, refreshToken, role, id, email } = await this._verifyOtpUseCase.execute(otpToken, otp);

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
    } catch (error: unknown) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: (error as Error).message });
    }
  }



  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { oldOtpToken } = req.body;
      const { otpToken } = await this._resendOtpUseCase.execute(oldOtpToken);

      res.status(StatusCodes.OK).json({
        message: OtpError.RESEND_OTP,
        otpToken,
      });
    } catch (error: unknown) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: (error as Error).message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.REFRESH_TOKEN_MISSING });
        return;
      }

      const result = await this._refreshTokenUseCase.execute(refreshToken);

      res.status(StatusCodes.OK).json({
        success: true,
        accessToken: result.authToken,
        role: result.role
      });
    } catch (error: unknown) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.INVALID_REFRESH_TOKEN });
    }
  }
}

