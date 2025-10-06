import { Request, Response } from "express";
import { IParentSignupUseCase } from "../../../../domain/UseCaseInterface/IParentSignupUseCase";

export class SignupParentController {
  constructor(private useCase: IParentSignupUseCase) {}

  async signUp(req: Request, res: Response) {
    try {
      const { studentId, email, password } = req.body;

      
      if (!studentId || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

    
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
        });
      }

  
      const parent = await this.useCase.execute(studentId, email, password);

      res.status(201).json({
        message: "Parent registered successfully",
        parent,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
