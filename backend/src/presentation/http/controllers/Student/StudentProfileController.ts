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
      console.log("student",studentId)

      if (!studentId) {
         res.status(400).json({ message: "Student ID missing" });
         return
      }

      const student = await this.studentprofile.execute(studentId);
      if (!student) {
        console.log("not get ",student)
         res.status(404).json({ message: "Student not found" });
         return
      }

       res.status(200).json({ success: true, data: student });
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ message: "Internal server error" });
       return
    }
  }
}
