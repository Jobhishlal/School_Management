

import { Request, Response } from "express";

export interface IAdminController {
  signupRequest(req: Request, res: Response): Promise<void>;
  getAll(req: Request, res: Response): Promise<void>;
  verifyOtp(req:Request,res:Response):Promise<void>;
  resentOtp(req:Request,res:Response):Promise<void>;
}
