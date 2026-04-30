import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { ExamMarkCreateUseCase } from "../../../../applications/useCases/Exam/ExamMarkCreateUseCase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { CreateExamMarkDTO } from "../../../../applications/dto/Exam/CreateExamMarkDTO";
import { GetStudentsByExamUseCase } from "../../../../applications/useCases/Exam/exammarkviewgetusecase";
import { UpdateExamMarkUseCase } from "../../../../applications/useCases/Exam/UpdateExamMarkUseCase";
import { ResolveExamConcernUseCase } from "../../../../applications/useCases/Exam/ResolveExamConcernUseCase";

export class ExamMarkManagementController {
  constructor(
    private repo: ExamMarkCreateUseCase,
    private getexammark: GetStudentsByExamUseCase,
    private updateMarkUseCase: UpdateExamMarkUseCase,
    private resolveConcernUseCase: ResolveExamConcernUseCase
  ) { }

  // ... existing methods ...

  async resolveConcern(req: AuthRequest, res: Response) {
    try {
      const { examMarkId, status, newMarks, responseMessage } = req.body;
      const teacherId = req.user?.id;

      if (!teacherId) return res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });

      const result = await this.resolveConcernUseCase.execute(examMarkId, status, newMarks, responseMessage);

      if (result) {
        return res.status(StatusCodes.OK).json({ success: true, message: RESPONSE_MESSAGES.CONCERN_RESOLVED_SUCCESSFULLY });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: RESPONSE_MESSAGES.FAILED_TO_RESOLVE_CONCERN });
      }
    } catch (error: unknown) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Internal server error",
      });
    }
  }


  async CreateExamMark(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log("reached here")
      const teacherId = req.user?.id;
      console.log("teacherId", teacherId)
      if (!teacherId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.TEACHER_ID_NOT_FOUND,
          success: false,
        });
        return;
      }

      const values: CreateExamMarkDTO = req.body;
      console.log("values", values)

      const data = await this.repo.execute(teacherId, values);
      console.log("data bjadbjkbajk fjna df", data)

      res.status(StatusCodes.CREATED).json({
        message: RESPONSE_MESSAGES.EXAM_MARK_CREATED_SUCCESSFULLY,
        success: true,
        data,
      });
    } catch (error: unknown) {
      console.log("error", error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: (error as Error).message || "Internal server error",
        success: false,
        error,
      });
    }
  }

  async getStudentsByExam(req: AuthRequest, res: Response) {
    try {
      console.log("reached here");
      const teacherId = req.user?.id?.toString();
      console.log("teacherId get", teacherId);

      const { examId } = req.params;
      console.log("examId", examId);

      if (!teacherId) return res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
      if (!examId) return res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.EXAM_ID_MISSING });

      const students = await this.getexammark.execute(teacherId, examId);
      console.log("student full details", students);

      return res.status(StatusCodes.OK).json({
        success: true,
        data: students,
      });
    } catch (error: unknown) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async updateExamMark(req: AuthRequest, res: Response): Promise<void> {
    try {
      const teacherId = req.user?.id;
      if (!teacherId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.TEACHER_ID_NOT_FOUND,
          success: false,
        });
        return;
      }

      const values: CreateExamMarkDTO = req.body;
      const data = await this.updateMarkUseCase.execute(teacherId, values);
      console.log("data", data)

      res.status(StatusCodes.OK).json({
        message: RESPONSE_MESSAGES.EXAM_MARK_UPDATED_SUCCESSFULLY,
        success: true,
        data,
      });
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: (error as Error).message || "Internal server error",
        success: false,
        error,
      });
    }
  }


}