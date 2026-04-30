import { Request,Response } from "express";
import { IResetParentPasswordUseCase } from "../../../../applications/interface/UseCaseInterface/Parent/IResetParentPasswordUseCase";
import { IRequestPasswordOtpUseCase } from '../../../../applications/interface/UseCaseInterface/IPasswordUpdateUseCase';
import { IVerifyPasswordOtpUseCase } from '../../../../applications/interface/UseCaseInterface/IVerifyParentForgot';
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { AUTH_MESSAGES } from "../../../../shared/constants/messages";


export class ForgotPasswordController{
    constructor(private resetpass:IResetParentPasswordUseCase,private requestparent:IRequestPasswordOtpUseCase,private verifyotp:IVerifyPasswordOtpUseCase){}
    async ReqestPasswordchange(req:Request,res:Response):Promise<void>{
   try {
      const { email } = req.body;
      const { otpToken } = await this.requestparent.execute(email);
      res.status(StatusCodes.CREATED).json({ otpToken, message: AUTH_MESSAGES.OTP_SENT_SUCCESS });
    } catch (err: unknown) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
    }
    }
    async verifyOtp(req:Request,res:Response):Promise<void>{
      console.log("i am reached verify otp")
     try {
      const { otpToken, otp } = req.body;
      console.log(req.body)
      const { email } = await this.verifyotp.execute(otpToken, otp);

      res.status(StatusCodes.CREATED).json({ email, message: AUTH_MESSAGES.OTP_VERIFIED_SUCCESS });
    } catch (err: unknown) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
    }
    }

    async ResetPassword(req:Request,res:Response):Promise<void>{
         try {
      const { email, newPassword } = req.body;
      console.log(newPassword)
      await this.resetpass.execute(email, newPassword);
      console.log("entere password",email,newPassword)
      res.status(StatusCodes.CREATED).json({ message: AUTH_MESSAGES.PASSWORD_UPDATE_SUCCESS });
    } catch (err: unknown) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
    }
    }
}