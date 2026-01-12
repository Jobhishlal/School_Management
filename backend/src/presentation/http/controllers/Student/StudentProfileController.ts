import {IStudentProfileUseCase} from '../../../../domain/UseCaseInterface/StudentCreate/IStudentProfile';
import { Request,Response } from 'express';
import { StatusCodes } from '../../../../shared/constants/statusCodes';
import { StudentProfile } from '../../../../domain/enums/Student/StudentProfile';
import { AuthRequest } from '../../../../infrastructure/types/AuthRequest';


export class StudentProfileController { 
  constructor(private readonly studentprofile: IStudentProfileUseCase) {}

  async GetProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
     
      const studentId = req.params.studentId || req.user?.id;
    

      if (!studentId) {
         res.status(StatusCodes.BAD_REQUEST).json({ message: "Student ID missing" });
         return
      }

      const student = await this.studentprofile.execute(studentId);
      if (!student) {
        console.log("not get ",student)
         res.status(StatusCodes.NOT_FOUND).json({ message: "Student not found" });
         return
      }

       res.status(StatusCodes.OK).json({ success: true, data: student });
       return
    } catch (error) {
      console.error(error);
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
       return
    }
  }
}
