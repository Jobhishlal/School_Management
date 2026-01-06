import { IAttendanceCreateUseCase } from "../../../../domain/UseCaseInterface/Attandance/ITakeAttendanceUseCase";
import { Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { TakeAttendance } from "../../../../applications/dto/Attendance/TakeAttendanceDTO";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { IGetStudentsByClassUseCase } from "../../../../domain/UseCaseInterface/StudentCreate/IStudentFindClassBase";
import { IFindStudentsByTeacherUseCase } from "../../../../domain/UseCaseInterface/IFindStudentsByTeacherUseCase";
import { IAttendanceList } from "../../../../domain/UseCaseInterface/Attandance/IAttendanceTeacherList";
import { IGetAttendanceReportUseCase } from "../../../../domain/UseCaseInterface/Attandance/IGetAttendanceReportUseCase";
import { IGetStudentAttendanceHistoryUseCase } from "../../../../domain/UseCaseInterface/Attandance/IGetStudentAttendanceHistoryUseCase";
import { IUpdateAttendanceUseCase } from "../../../../domain/UseCaseInterface/Attandance/IUpdateAttendanceUseCase";



export class AttendanceController {
  constructor(
    private repo: IAttendanceCreateUseCase,
    private studentclassrepofind: IGetStudentsByClassUseCase,
    private findStudentsUseCase: IFindStudentsByTeacherUseCase,
    private attendancelist: IAttendanceList,
    private getReportUseCase: IGetAttendanceReportUseCase,
    private getStudentHistoryUseCase: IGetStudentAttendanceHistoryUseCase,
    private updateAttendanceUseCase: IUpdateAttendanceUseCase
  ) {}

  async Create(req: AuthRequest, res: Response): Promise<void> {
    try {

      const data: TakeAttendance = {
        ...req.body,
        teacherId: req.user?.id,
      };
      
      const create = await this.repo.execute(data);
     

      if (!create) {
       
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Attendance creation failed",
          success: false,
        });
      }


      res.status(StatusCodes.CREATED).json({
        message: "Attendance created successfully",
        success: true,
        create,
      });
    } catch (error: any) {
      console.error("error", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Internal server error",
        success: false,
      });
    }
  }

  async FindStudntSClassBase(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { classId } = req.params
      const teacherId = req.user?.id

      const student = await this.studentclassrepofind.execute(classId, teacherId)
      console.log(student)
      if (!student) {
        console.log("stdent", student)
        res.status(StatusCodes.BAD_REQUEST)
          .json({ message: "does not fetch student in classbase" })
      }
      res.status(StatusCodes.OK)
        .json({ message: "data fetching successfully", success: true, student })
    } catch (error) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error", error })

    }
  }

  async findStudentsByTeacher(req: AuthRequest, res: Response): Promise<void> {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Unauthorized access",
          success: false,
        });
        return;
      }

      const students = await this.findStudentsUseCase.execute(teacherId);

      res.status(StatusCodes.OK).json({
        message: "Students fetched successfully",
        success: true,
        students,
      });
    } catch (error: any) {
      console.error("error happend here", error);
      if (error.message === "No class assigned to this teacher" || error.message === "No students found for this class") {
        res.status(StatusCodes.NOT_FOUND).json({
          message: error.message,
          success: false
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Internal server error",
        success: false,
      });
    }
  }


  async AttendanceList(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log("reached here")
      const { classId } = req.params;
      const { status } = req.query;
      console.log(classId)

      if (!classId) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Class ID is required" });
        return;
      }

      const attendance = await this.attendancelist.execute(classId, status as string);
      console.log(attendance)

      res.status(StatusCodes.OK).json({
        success: true,
        attendance,
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch attendance",
      });
    }
  }

  async getReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const { startDate, endDate } = req.query;

      if (!classId || !startDate || !endDate) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Class Id, Start Date and End Date are required",
        });
        return;
      }

      const report = await this.getReportUseCase.execute(
        classId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(StatusCodes.OK).json({
        success: true,
        report,
      });
    } catch (error: any) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch report",
      });
    }
  }

  async getStudentHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const { month, year } = req.query;

      if (!studentId || !month || !year) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Student ID, Month and Year are required",
        });
        return;
      }

      const history = await this.getStudentHistoryUseCase.execute(
        studentId,
        Number(month),
        Number(year)
      );

      res.status(StatusCodes.OK).json({
        success: true,
        history,
      });
    } catch (error: any) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch student history",
      });
    }
  }

  async updateAttendance(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { studentId, date, session, status } = req.body;

      if (!studentId || !date || !session || !status) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Student ID, Date, Session and Status are required",
        });
        return;
      }

      await this.updateAttendanceUseCase.execute(studentId, new Date(date), session, status);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Attendance updated successfully",
      });
    } catch (error: any) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to update attendance",
      });
    }
  }
}
