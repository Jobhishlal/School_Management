import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { IParentSignupUseCase } from "../../../../applications/interface/UseCaseInterface/IParentSignupUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class SignupParentController {
  constructor(private _useCase: IParentSignupUseCase) {}

  async signUp(req: Request, res: Response) {
    try {
      const { studentId, email, password } = req.body;

      
      if (!studentId || !email || !password) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.ALL_FIELDS_ARE_REQUIRED });
      }

    
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.INVALID_EMAIL_FORMAT });
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS_AND_INCLUDE,
        });
      }

  
      const parent = await this._useCase.execute({ studentId, email, password });

      res.status(StatusCodes.CREATED).json({
        message: RESPONSE_MESSAGES.PARENT_REGISTERED_SUCCESSFULLY,
        parent,
      });
    } catch (err: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (err as Error).message });
    }
  }
}
