import { Request, Response } from "express";
import { ExamMarkCreateUseCase } from "../../../../applications/useCases/Exam/ExamMarkCreateUseCase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { CreateExamMarkDTO } from "../../../../applications/dto/Exam/CreateExamMarkDTO";
import { GetStudentsByExamUseCase } from "../../../../applications/useCases/Exam/exammarkviewgetusecase";
import { UpdateExamMarkUseCase } from "../../../../applications/useCases/Exam/UpdateExamMarkUseCase";

export class ExamMarkManagementController {
  constructor(
    private repo: ExamMarkCreateUseCase,
    private getexammark: GetStudentsByExamUseCase,
    private updateMarkUseCase: UpdateExamMarkUseCase
  ) { }


  async CreateExamMark(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log("reached here")
      const teacherId = req.user?.id;
      console.log("teacherId", teacherId)
      if (!teacherId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Teacher ID not found",
          success: false,
        });
        return;
      }

      const values: CreateExamMarkDTO = req.body;
      console.log("values", values)

      const data = await this.repo.execute(teacherId, values);
      console.log("data bjadbjkbajk fjna df", data)

      res.status(StatusCodes.CREATED).json({
        message: "Exam mark created successfully",
        success: true,
        data,
      });
    } catch (error: any) {
      console.log("error", error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Internal server error",
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

      if (!teacherId) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Unauthorized" });
      if (!examId) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Exam ID missing" });

      const students = await this.getexammark.execute(teacherId, examId);
      console.log("student full details", students);

      return res.status(StatusCodes.OK).json({
        success: true,
        data: students,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateExamMark(req: AuthRequest, res: Response): Promise<void> {
    try {
      const teacherId = req.user?.id;
      if (!teacherId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Teacher ID not found",
          success: false,
        });
        return;
      }

      const values: CreateExamMarkDTO = req.body;
      const data = await this.updateMarkUseCase.execute(teacherId, values);

      res.status(StatusCodes.OK).json({
        message: "Exam mark updated successfully",
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Internal server error",
        success: false,
        error,
      });
    }
  }


}