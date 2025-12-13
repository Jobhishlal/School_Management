import { Request, Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { ITimeTableStudentview } from "../../../../domain/UseCaseInterface/TimeTable/ITimeTableviewSTD";
import { StudentTimeTableViewUseCase } from "../../../../applications/useCases/admin/TimeTable/StudentTimetableview";

export class StudentTimetableController {
  constructor(private readonly timetablerepo: StudentTimeTableViewUseCase) {}

  async TimeTableView(req: Request, res: Response): Promise<void> {
    try {
        console.log("reached")
      const { studentId } = req.query as { studentId: string };
         console.log("student",studentId)

      if (!studentId) {
        console.log("student time table")
        console.log("studentId",studentId)
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "studentId is Required",
        });
        return;
      }

      const timetable = await this.timetablerepo.execute(studentId);
      console.log("timetable view student",timetable)

      if (!timetable) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Timetable not found",
        });
        return;
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Timetable fetched successfully",
        data: timetable,
      });
    } catch (error) {
      console.error("Error fetching timetable:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
