import { IParentAttendanceUseCase } from "../../../../applications/interface/UseCaseInterface/Attandance/IParentAttendanceListUseCase";
import { Request, Response } from "express";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IParentDateBaseAttendance } from "../../../../applications/interface/UseCaseInterface/Attandance/IParentDateBaseAttendance";
import { AttendanceErrorEnums } from "../../../../shared/constants/AttendanceErrorEnums";
import { validateAttendanceFilter } from '../../../validators/AttendanceValidation/AttendanceValidators';

export class ParentAttendanceListController {
  constructor(
    private repo: IParentAttendanceUseCase,
    private datebase: IParentDateBaseAttendance
  ) { }

  async ParentAttendanceList(req: AuthRequest, res: Response): Promise<void> {
    try {
      const parentId = req.user?.id;


      if (!parentId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Parent not authenticated",
        });
        return;
      }

      const attendance = await this.repo.execute(parentId);
      console.log(attendance)

      res.status(StatusCodes.OK).json({
        success: true,
        data: attendance,
      });
    } catch (error: any) {
      console.error(error);
      if (error.message === "Parent or student not found" || error.message === "student does not found") {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }


  async ParentDateBaseFindAttendance(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const parentId = req.user?.id;
      const { startDate, endDate } = req.query;

      if (!parentId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Parent not authenticated",
        });
        return;
      }

      validateAttendanceFilter(startDate, endDate);

      const result = await this.datebase.execute(
        parentId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      console.log(result)

      res.status(StatusCodes.OK).json({
        message: "Attendance details fetched successfully",
        result,
      });
    } catch (error: any) {
      if (Object.values(AttendanceErrorEnums).includes(error.message)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error?.message ?? "Internal server error",
      });
    }
  }

}