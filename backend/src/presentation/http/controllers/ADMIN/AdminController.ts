import { Request, Response } from "express";
import { IAdminController } from "../../interface/IAdminController";
import { SignupAdmin } from "../../../../applications/useCases/SignupAdmin";
import { GetAdmin } from "../../../../applications/useCases/GetAdmin";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { AdminError } from "../../../../domain/enums/Adminsinguperror";
import { GenarateOtpP } from "../../../../applications/useCases/GenarateOpt";
import {verifiedOtptoken} from '../../../../infrastructure/security/otpJwtService'
import { ResendOtp } from "../../../../applications/useCases/ResenOtp";

export class AdminController implements IAdminController {
  constructor(
    private signupUseCase: SignupAdmin,
    private getAdminUseCase: GetAdmin,
    private generateOtpUseCase: GenarateOtpP,
    private resendOtpUseCase:ResendOtp
  ) {}


  async signupRequest(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      const { otpToken } = await this.generateOtpUseCase.execute(
        username,
        email,
        password
      );

      res
        .status(StatusCodes.OK)
        .json({ message: "OTP sent to email", otpToken });
    } catch (err: any) {
      if (err.message === AdminError.Useralreadyexisted) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "user already existed" });
        return;
      }
      if (err.message === AdminError.UniqueUser_id) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Create Unique UserName" });
        return;
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "something went wrong" });
    }
  }

async verifyOtp(req: Request, res: Response): Promise<void> {
  try {
    const { otpToken, otp } = req.body;

    if (!otpToken || !otp) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "OTP and token are required" });
      return;
    }

   
    const decoded = verifiedOtptoken(otpToken);

    if (!decoded) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired OTP token" });
      return;
    }

    if (decoded.otp !== otp) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid OTP" });
      return;
    }

    const { username, email, password } = decoded;

    if (!username || !email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing user data in OTP token" });
      return;
    }

   
    const admin = await this.signupUseCase.execute({
      username,
      email,
      password,
      otp,
      otpToken,
    });

   

    res.status(StatusCodes.CREATED).json({
      message: "Signup successful",
      admin,
    });
  } catch (err: any) {
    console.error("Verify OTP error:", err);

    if (err.message === AdminError.Useralreadyexisted) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "User already existed" });
      return;
    }

    if (err.message === AdminError.UniqueUser_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Create unique username" });
      return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}



async resentOtp(req:Request,res:Response):Promise<void>{
  try {
   const { oldOtpToken } = req.body;
  

   const { otpToken } = await this.resendOtpUseCase.execute(oldOtpToken);

res.status(StatusCodes.OK).json({
  message: "New Otp share Your Email",
  otpToken: otpToken
})




    
  } catch (error:any) {
 if (error.message === AdminError.Invalid_otp) {
  res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or expired OTP" });
  return;
}


   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Its Server Error"})

  }
}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const admin = await this.getAdminUseCase.execute();
      res.status(StatusCodes.OK).json(admin);
    } catch (err: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
    }
  }
}
