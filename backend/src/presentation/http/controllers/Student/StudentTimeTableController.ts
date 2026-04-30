import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { ITimeTableStudentview } from "../../../../applications/interface/UseCaseInterface/TimeTable/ITimeTableviewSTD";
import { StudentTimeTableViewUseCase } from "../../../../applications/useCases/admin/TimeTable/StudentTimetableview";

export class StudentTimetableController {
  constructor(private readonly timetablerepo: StudentTimeTableViewUseCase) { }

  async TimeTableView(req: Request, res: Response): Promise<void> {
    try {
      console.log("reached")
      const { studentId } = req.query as { studentId: string };
      console.log("student", studentId)

      if (!studentId) {
        console.log("student time table")
        console.log("studentId", studentId)
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: RESPONSE_MESSAGES.STUDENTID_IS_REQUIRED_1,
        });
        return;
      }

      const timetable = await this.timetablerepo.execute(studentId);
      console.log("timetable object keys:", Object.keys(timetable || {}));
      if (timetable && timetable.days) {
        timetable.days.forEach((day, index) => {
          console.log(`Day ${index} (${day.day}):`, JSON.stringify(day));
          console.log(`Day ${index} breaks:`, day.breaks);
        });
      }

      if (!timetable) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: RESPONSE_MESSAGES.TIMETABLE_NOT_FOUND,
        });
        return;
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.TIMETABLE_FETCHED_SUCCESSFULLY,
        data: timetable,
      });
    } catch (error) {
      console.error("Error fetching timetable:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
