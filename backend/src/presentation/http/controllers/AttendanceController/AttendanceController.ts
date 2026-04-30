import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { IAttendanceCreateUseCase } from "../../../../applications/interface/UseCaseInterface/Attandance/ITakeAttendanceUseCase";
import { Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { TakeAttendance } from "../../../../applications/dto/Attendance/TakeAttendanceDTO";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { IGetStudentsByClassUseCase } from "../../../../applications/interface/UseCaseInterface/StudentCreate/IStudentFindClassBase";
import { IFindStudentsByTeacherUseCase } from "../../../../applications/interface/UseCaseInterface/IFindStudentsByTeacherUseCase";
import { IAttendanceList } from "../../../../applications/interface/UseCaseInterface/Attandance/IAttendanceTeacherList";
import { IGetAttendanceReportUseCase } from "../../../../applications/interface/UseCaseInterface/Attandance/IGetAttendanceReportUseCase";
import { IGetStudentAttendanceHistoryUseCase } from "../../../../applications/interface/UseCaseInterface/Attandance/IGetStudentAttendanceHistoryUseCase";
import { IUpdateAttendanceUseCase } from "../../../../applications/interface/UseCaseInterface/Attandance/IUpdateAttendanceUseCase";
import { validateAttendanceTake } from '../../../validators/AttendanceValidation/AttendanceValidators';



export class AttendanceController {
  constructor(
    private _repo: IAttendanceCreateUseCase,
    private _studentclassrepofind: IGetStudentsByClassUseCase,
    private _findStudentsUseCase: IFindStudentsByTeacherUseCase,
    private _attendancelist: IAttendanceList,
    private _getReportUseCase: IGetAttendanceReportUseCase,
    private _getStudentHistoryUseCase: IGetStudentAttendanceHistoryUseCase,
    private _updateAttendanceUseCase: IUpdateAttendanceUseCase
  ) { }

  async Create(req: AuthRequest, res: Response): Promise<void> {
    try {

      const data: TakeAttendance = {
        ...req.body,
        teacherId: req.user?.id,
      };

      validateAttendanceTake(data);

      const create = await this._repo.execute(data);


      if (!create) {

        res.status(StatusCodes.BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.ATTENDANCE_CREATION_FAILED,
          success: false,
        });
      }


      res.status(StatusCodes.CREATED).json({
        message: RESPONSE_MESSAGES.ATTENDANCE_CREATED_SUCCESSFULLY,
        success: true,
        create,
      });
    } catch (error: unknown) {
      console.error("error", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: (error as Error).message || "Internal server error",
        success: false,
      });
    }
  }

  async FindStudntSClassBase(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { classId } = req.params
      const teacherId = req.user?.id

      const student = await this._studentclassrepofind.execute(classId, teacherId)
      console.log(student)
      if (!student) {
        console.log("stdent", student)
        res.status(StatusCodes.BAD_REQUEST)
          .json({ message: RESPONSE_MESSAGES.DOES_NOT_FETCH_STUDENT_IN_CLASSBASE })
      }
      res.status(StatusCodes.OK)
        .json({ message: RESPONSE_MESSAGES.DATA_FETCHING_SUCCESSFULLY, success: true, student })
    } catch (error) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_1, error })

    }
  }

  async findStudentsByTeacher(req: AuthRequest, res: Response): Promise<void> {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: RESPONSE_MESSAGES.UNAUTHORIZED_ACCESS,
          success: false,
        });
        return;
      }

      const students = await this._findStudentsUseCase.execute(teacherId);

      res.status(StatusCodes.OK).json({
        message: RESPONSE_MESSAGES.STUDENTS_FETCHED_SUCCESSFULLY,
        success: true,
        students,
      });
    } catch (error: unknown) {
      console.error("error happend here", error);
      if ((error as Error).message === "No class assigned to this teacher" || (error as Error).message === "No students found for this class") {
        res.status(StatusCodes.NOT_FOUND).json({
          message: (error as Error).message,
          success: false
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: (error as Error).message || "Internal server error",
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
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: RESPONSE_MESSAGES.CLASS_ID_IS_REQUIRED });
        return;
      }

      const attendance = await this._attendancelist.execute(classId, status as string);
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
        message: RESPONSE_MESSAGES.FAILED_TO_FETCH_ATTENDANCE,
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
          message: RESPONSE_MESSAGES.CLASS_ID_START_DATE_AND_END_DATE_ARE_REQUIRED,
        });
        return;
      }

      const report = await this._getReportUseCase.execute(
        classId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(StatusCodes.OK).json({
        success: true,
        report,
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to fetch report",
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
          message: RESPONSE_MESSAGES.STUDENT_ID_MONTH_AND_YEAR_ARE_REQUIRED,
        });
        return;
      }

      const history = await this._getStudentHistoryUseCase.execute(
        studentId,
        Number(month),
        Number(year)
      );

      res.status(StatusCodes.OK).json({
        success: true,
        history,
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to fetch student history",
      });
    }
  }

  async updateAttendance(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { studentId, date, session, status } = req.body;

      if (!studentId || !date || !session || !status) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: RESPONSE_MESSAGES.STUDENT_ID_DATE_SESSION_AND_STATUS_ARE_REQUIRED,
        });
        return;
      }

      await this._updateAttendanceUseCase.execute({ studentId, date: new Date(date), session, status, teacherId: req.user?.id as string });

      res.status(StatusCodes.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.ATTENDANCE_UPDATED_SUCCESSFULLY,
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to update attendance",
      });
    }
  }
}
