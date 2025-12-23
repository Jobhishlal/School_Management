import { Request,Response } from "express";
import { IStudentExamListUseCase } from "../../../../domain/UseCaseInterface/Exam/IExamClassbaseviewusecase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { IGetStudentExamResultsUseCase } from "../../../../domain/UseCaseInterface/Exam/StudentSeeExamMarks";

export class StudentviewExamController {
    constructor(
        private readonly classbaseviewpage:IStudentExamListUseCase,
        private readonly studentexamresultview:IGetStudentExamResultsUseCase
    
    ){}

    async classbaseexamviewpage(req: AuthRequest, res: Response): Promise<void> {

  try {
    console.log("i am reached here")
    const teacherId = req.user?.id;
    console.log(teacherId)

    if (!teacherId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "teacherId not found",
        success: false,
      });
      return;
    }

    const data = await this.classbaseviewpage.execute(teacherId);
        console.log("data",data)
    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      success: false,
      error,
    });
  }
}
 async getStudentExamResults(req: AuthRequest, res: Response) {
  try {
    const studentId = req.user?.id;
    const {classId}=req.body;

    if (!studentId || !classId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          success: false,
          message: "StudentId or ClassId missing",
        });
    }

    const data = await this.studentexamresultview.execute(
      studentId,
      classId
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

}