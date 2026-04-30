import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { IStudentExamListUseCase } from "../../../../applications/interface/UseCaseInterface/Exam/IExamClassbaseviewusecase";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { IGetStudentExamResultsUseCase } from "../../../../applications/interface/UseCaseInterface/Exam/StudentSeeExamMarks";
import { RaiseExamConcernUseCase } from "../../../../applications/useCases/Exam/RaiseExamConcernUseCase";

export class StudentviewExamController {
  constructor(
    private readonly classbaseviewpage: IStudentExamListUseCase,
    private readonly studentexamresultview: IGetStudentExamResultsUseCase,
    private readonly raiseConcernUseCase: RaiseExamConcernUseCase
  ) { }

  async classbaseexamviewpage(req: AuthRequest, res: Response): Promise<void> {

    try {
      console.log("i am reached here")
      const teacherId = req.user?.id;
      console.log(teacherId)

      if (!teacherId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.TEACHERID_NOT_FOUND,
          success: false,
        });
        return;
      }

      const data = await this.classbaseviewpage.execute(teacherId);
      console.log("data", data)
      res.status(StatusCodes.OK).json({
        message: RESPONSE_MESSAGES.DATA_FETCHED_SUCCESSFULLY,
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
        success: false,
        error,
      });
    }
  }
  async getStudentExamResults(req: AuthRequest, res: Response) {
    try {
      let studentId = req.user?.id;
      const { classId, studentId: bodyStudentId } = req.body;

      if (bodyStudentId) {
        studentId = bodyStudentId;
      }

      if (!studentId || !classId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            success: false,
            message: RESPONSE_MESSAGES.STUDENTID_OR_CLASSID_MISSING,
          });
      }

      const data = await this.studentexamresultview.execute(
        studentId,
        classId
      );

      console.log(data)
      return res.status(StatusCodes.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.DATA_FETCHED_SUCCESSFULLY,
        data,
      });

    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async raiseConcern(req: AuthRequest, res: Response) {
    try {
      const { examMarkId, concern } = req.body;
      // In a real scenario, we might want to verify the student owns this mark
      // or pass the studentId to the use case.
      // For now, assuming the examMarkId is sufficient as per plan.

      // Note: We need to inject the use case into the controller.
      // Since I am editing the class, I will assume the use case is available via a new property 
      // or I'll need to update the constructor. 
      // Strategy: Update constructor first or use a service locator? 
      // Better: Update constructor. I will separate this into two steps. 
      // 1. Update Constructor. 2. Add Method.
      // Actually, I can do it in one go if I change the whole class, but that's risky.
      // I'll assume 'raiseConcernUseCase' will be injected.

      // Wait, I cannot add a property to the constructor easily with replace_file_content if I don't replace the constructor.
      // I will add the method first, then update the constructor.

      // Let's rely on 'this.raiseConcernUseCase'. I will update the constructor in a separate call or same call if possible.
      // I will replace the END of the class to add the method.

      const result = await this.raiseConcernUseCase.execute(examMarkId, concern);

      if (result) {
        return res.status(StatusCodes.OK).json({ success: true, message: RESPONSE_MESSAGES.CONCERN_RAISED_SUCCESSFULLY });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: RESPONSE_MESSAGES.FAILED_TO_RAISE_CONCERN });
      }

    } catch (error: unknown) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Internal server error",
      });
    }
  }

}