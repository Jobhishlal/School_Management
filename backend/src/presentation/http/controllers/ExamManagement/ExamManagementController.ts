import { Response } from "express";
import { IExamCreateRepository } from "../../../../domain/UseCaseInterface/Exam/IExamCreateUseCase";
import { CreateExamDTO } from "../../../../applications/dto/Exam/CreateExamDTO";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { Types } from "mongoose";
import { IExamUpdateTeacherUseCase } from "../../../../domain/UseCaseInterface/Exam/IExamUpdateUseCase";
import { UpdateExamDTO } from "../../../../applications/dto/Exam/UpdateExamDTO";
import { IGetTeacherExamsUseCase } from "../../../../domain/UseCaseInterface/Exam/IExamFindTeacherIdbase";
import { IExamFindByClassUseCase } from "../../../../domain/UseCaseInterface/Exam/IExamFindClassBase";


export class ExamManagementController {
  constructor(
    private repo: IExamCreateRepository,
    private update: IExamUpdateTeacherUseCase,
    private getTeacherExamsUseCase: IGetTeacherExamsUseCase,
    private examfindclassbase: IExamFindByClassUseCase,



  ) { }

  async CreateExam(req: AuthRequest, res: Response): Promise<void> {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { classId, teacherId: bodyTeacherId, title, type, division, className, subject, examDate, startTime, endTime, maxMarks, passMarks, description } = req.body;





      if (!Types.ObjectId.isValid(bodyTeacherId)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid teacherId",
        });
      }

      const examData: CreateExamDTO = {
        examId: req.body.examId || "",
        title,
        type,
        classId,
        className,
        division,
        subject,
        teacherId: new Types.ObjectId(bodyTeacherId),
        teacherName: req.body.teacherName,
        examDate: new Date(examDate),
        startTime,
        endTime,
        maxMarks: Number(maxMarks),
        passMarks: Number(passMarks),
        description: description || "",
      };


      const data = await this.repo.execute(examData);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Exam created successfully",
        data,
      });
    } catch (error: any) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  async UpdateExam(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateExamDTO = req.body;
      console.log("reached here", data)




      const updatedExam = await this.update.execute(id, data);
      console.log("dsafjkhdaskfnakdbj", updatedExam)

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Exam updated successfully",
        data: updatedExam,
      });
    } catch (error: any) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Internal server error",
        success: false,
      });
    }
  }
  async getTeacherExams(req: AuthRequest, res: Response): Promise<void> {
    try {
      const teacherId = req.user?.id;
      console.log(teacherId)

      if (!teacherId) {
        console.log("reached", teacherId)
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const exams = await this.getTeacherExamsUseCase.execute(teacherId);



      res.status(StatusCodes.OK).json({
        success: true,
        message: "Teacher exams fetched successfully",
        data: exams,
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        error,
      });
    }

  }


  async FindExamClassBase(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log("rached class base find page")
      const { classId } = req.params;
      const teacherId = req.user?.id;

      if (!classId || !teacherId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "classId or teacherId missing",
        });
        return;
      }

      const exams = await this.examfindclassbase.execute({
        classId,
        teacherId,
      });
      console.log("exams", exams)

      res.status(StatusCodes.OK).json({
        success: true,
        message: "successfully fetched class based exams",
        data: exams,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "internal server error",
        error,
      });
    }
  }


}
