import { Response } from "express";
import { IAnnoucementfindclassBase } from "../../../../applications/interface/UseCaseInterface/Announcement/IAnnouncementReadUseCase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { IStudentProfileUseCase } from "../../../../applications/interface/UseCaseInterface/StudentCreate/IStudentProfile";



export class AnnouncementReadController {
  constructor(
    private readonly announcementUseCase: IAnnoucementfindclassBase,
    private readonly studentProfileUseCase: IStudentProfileUseCase
  ) {}

  async Findannouncement(req: AuthRequest, res: Response): Promise<void> {
    try {
   
      const studentId = req.user?.id;
      console.log("studentId from token:", studentId);

      if (!studentId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

        

      const student = await this.studentProfileUseCase.execute(studentId);

      if (!student || !student.classId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Student or class not found",
        });
        return;
      }

      const classId =
        typeof student.classId === "string"
          ? student.classId:student.classDetails
          
      console.log("classId:", classId);

      const data = await this.announcementUseCase.execute({
        studentId,
        classes: [student.classId],
      });

   
      res.status(StatusCodes.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
