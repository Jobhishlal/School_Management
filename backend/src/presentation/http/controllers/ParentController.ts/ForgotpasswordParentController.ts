import { Request,Response } from "express";
import { ResetParentPasswordUseCase } from "../../../../applications/useCases/Parent/ResetPasswordUseCasse";
import {RequestParentPasswordOtpUseCase} from '../../../../applications/useCases/Parent/ForgotPasswordUseCase';
import {VerifyParentPasswordOtpUseCase} from '../../../../applications/useCases/Parent/VerifyParentOtpUseCase';
import { StatusCodes } from "../../../../shared/constants/statusCodes";


export class ForgotPasswordController{
    constructor(private resetpass:ResetParentPasswordUseCase,private requestparent:RequestParentPasswordOtpUseCase,private verifyotp:VerifyParentPasswordOtpUseCase){}
    async ReqestPasswordchange(req:Request,res:Response):Promise<void>{
   try {
      const { email } = req.body;
      const { otpToken } = await this.requestparent.execute(email);
      res.status(StatusCodes.CREATED).json({ otpToken, message: "OTP sent to your email" });
    } catch (err: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
    }
    async verifyOtp(req:Request,res:Response):Promise<void>{
      console.log("i am reached verify otp")
     try {
      const { otpToken, otp } = req.body;
      console.log(req.body)
      const { email } = await this.verifyotp.execute(otpToken, otp);

      res.status(StatusCodes.CREATED).json({ email, message: "OTP verified" });
    } catch (err: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
    }

    async ResetPassword(req:Request,res:Response):Promise<void>{
         try {
      const { email, newPassword } = req.body;
      console.log(newPassword)
      await this.resetpass.execute(email, newPassword);
      console.log("entere password",email,newPassword)
      res.status(StatusCodes.CREATED).json({ message: "Password updated successfully" });
    } catch (err: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
    }
}