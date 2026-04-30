import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { IStudentProfileUseCase } from '../../../../applications/interface/UseCaseInterface/StudentCreate/IStudentProfile';
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
         res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.STUDENT_ID_MISSING });
         return
      }

      const student = await this.studentprofile.execute(studentId);
      if (!student) {
        console.log("not get ",student)
         res.status(StatusCodes.NOT_FOUND).json({ message: RESPONSE_MESSAGES.STUDENT_NOT_FOUND_1 });
         return
      }

       res.status(StatusCodes.OK).json({ success: true, data: student });
       return
    } catch (error) {
      console.error(error);
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR });
       return
    }
  }
}
