import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
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
          message: RESPONSE_MESSAGES.PARENT_NOT_AUTHENTICATED,
        });
        return;
      }

      const attendance = await this.repo.execute(parentId);
      console.log(attendance)

      res.status(StatusCodes.OK).json({
        success: true,
        data: attendance,
      });
    } catch (error: unknown) {
      console.error(error);
      if ((error as Error).message === "Parent or student not found" || (error as Error).message === "student does not found") {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: (error as Error).message,
        });
        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Internal server error",
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
          message: RESPONSE_MESSAGES.PARENT_NOT_AUTHENTICATED,
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
        message: RESPONSE_MESSAGES.ATTENDANCE_DETAILS_FETCHED_SUCCESSFULLY,
        result,
      });
    } catch (error: unknown) {
      if (Object.values(AttendanceErrorEnums).includes((error as Error).message as AttendanceErrorEnums)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: (error as Error).message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: (error as Error).message ?? "Internal server error",
      });
    }
  }

}