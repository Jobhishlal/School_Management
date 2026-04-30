import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { IAdminController } from "../../interface/IAdminController";
import { SignupAdmin } from "../../../../applications/useCases/Auth/SignupAdmin";
import { GetAdmin } from "../../../../applications/useCases/admin/GetAdmin";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { AdminError } from "../../../../domain/enums/Adminsinguperror";
import { GenarateOtpP } from "../../../../applications/useCases/Auth/GenarateOpt";
import {verifiedOtptoken} from '../../../../infrastructure/security/otpJwtService'
import { ResendOtp } from "../../../../applications/useCases/Auth/ResenOtp";

export class AdminController implements IAdminController {
  constructor(
    private _signupUseCase: SignupAdmin,
    private _getAdminUseCase: GetAdmin,
    private _generateOtpUseCase: GenarateOtpP,
    private _resendOtpUseCase:ResendOtp
  ) {}


  async signupRequest(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      const { otpToken } = await this._generateOtpUseCase.execute(
        username,
        email,
        password
      );

      res
        .status(StatusCodes.OK)
        .json({ message: RESPONSE_MESSAGES.OTP_SENT_TO_EMAIL, otpToken });
    } catch (err: unknown) {
      if ((err as Error).message === AdminError.Useralreadyexisted) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: RESPONSE_MESSAGES.USER_ALREADY_EXISTED });
        return;
      }
      if ((err as Error).message === AdminError.UniqueUser_id) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: RESPONSE_MESSAGES.CREATE_UNIQUE_USERNAME });
        return;
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: RESPONSE_MESSAGES.SOMETHING_WENT_WRONG });
    }
  }

async verifyOtp(req: Request, res: Response): Promise<void> {
  try {
    const { otpToken, otp } = req.body;

    if (!otpToken || !otp) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.OTP_AND_TOKEN_ARE_REQUIRED });
      return;
    }

   
    const decoded = verifiedOtptoken(otpToken);

    if (!decoded) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.INVALID_OR_EXPIRED_OTP_TOKEN });
      return;
    }

    if (decoded.otp !== otp) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.INVALID_OTP });
      return;
    }

    const { username, email, password } = decoded;

    if (!username || !email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.MISSING_USER_DATA_IN_OTP_TOKEN });
      return;
    }

   
    const admin = await this._signupUseCase.execute({
      username,
      email,
      password,
      otp,
      otpToken,
    });

   

    res.status(StatusCodes.CREATED).json({
      message: RESPONSE_MESSAGES.SIGNUP_SUCCESSFUL,
      admin,
    });
  } catch (err: unknown) {
    console.error("Verify OTP error:", err);

    if ((err as Error).message === AdminError.Useralreadyexisted) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.USER_ALREADY_EXISTED_1 });
      return;
    }

    if ((err as Error).message === AdminError.UniqueUser_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.CREATE_UNIQUE_USERNAME_1 });
      return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.SOMETHING_WENT_WRONG_1 });
  }
}



async resentOtp(req:Request,res:Response):Promise<void>{
  try {
   const { oldOtpToken } = req.body;
  

   const { otpToken } = await this._resendOtpUseCase.execute(oldOtpToken);

res.status(StatusCodes.OK).json({
  message: RESPONSE_MESSAGES.NEW_OTP_SHARE_YOUR_EMAIL,
  otpToken: otpToken
})




    
  } catch (error: unknown) {
 if ((error as Error).message === AdminError.Invalid_otp) {
  res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.INVALID_OR_EXPIRED_OTP });
  return;
}


   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: RESPONSE_MESSAGES.ITS_SERVER_ERROR})

  }
}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const admin = await this._getAdminUseCase.execute();
      res.status(StatusCodes.OK).json(admin);
    } catch (err: unknown) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: (err as Error).message });
    }
  }
}
