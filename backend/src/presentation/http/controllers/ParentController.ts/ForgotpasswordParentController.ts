import { Request,Response } from "express";
import { IResetParentPasswordUseCase } from "../../../../applications/interface/UseCaseInterface/Parent/IResetParentPasswordUseCase";
import { IRequestPasswordOtpUseCase } from '../../../../applications/interface/UseCaseInterface/IPasswordUpdateUseCase';
import { IVerifyPasswordOtpUseCase } from '../../../../applications/interface/UseCaseInterface/IVerifyParentForgot';
import { StatusCodes } from "../../../../shared/constants/statusCodes";


export class ForgotPasswordController{
    constructor(private resetpass:IResetParentPasswordUseCase,private requestparent:IRequestPasswordOtpUseCase,private verifyotp:IVerifyPasswordOtpUseCase){}
    async ReqestPasswordchange(req:Request,res:Response):Promise<void>{
   try {
      const { email } = req.body;
      const { otpToken } = await this.requestparent.execute(email);
      res.status(StatusCodes.CREATED).json({ otpToken, message: "OTP sent to your email" });
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

      res.status(StatusCodes.CREATED).json({ email, message: "OTP verified" });
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
      res.status(StatusCodes.CREATED).json({ message: "Password updated successfully" });
    } catch (err: unknown) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: (err as Error).message });
    }
    }
}