import { RESPONSE_MESSAGES } from "../../../../../shared/constants/responseMessages";
import { StatusCodes } from "../../../../../shared/constants/statusCodes";
import { ICreateTimeTable } from "../../../../../applications/interface/UseCaseInterface/TimeTable/ICreateTimeTable";
import { IGETTIMETABLECLASS } from "../../../../../applications/interface/UseCaseInterface/TimeTable/IGetTimeTableClassUseCase";
import { IDeleteTimeTable } from "../../../../../applications/interface/UseCaseInterface/TimeTable/IDeleteTimeTableUseCase";
import { IUPDATETIMETABLE } from "../../../../../applications/interface/UseCaseInterface/TimeTable/IUpdateTimeTable";


import { CreateTimetableDTO } from "../../../../../applications/dto/CreateTImeTableDTO";
import { Request, Response } from "express";
import logger from "../../../../../shared/constants/Logger";
import { validateTimetableFormat } from "../../../../validators/Timetable/TimetableValidators";


export class TimeTableManageController {
  constructor(
    private readonly _createrepo: ICreateTimeTable,
    private readonly _gettimetable: IGETTIMETABLECLASS,
    private readonly _updatetimetable: IUPDATETIMETABLE,
    private readonly _deletetimetable: IDeleteTimeTable,


  ) { }

  async createTimetable(req: Request, res: Response): Promise<void> {
    try {
      console.log("i am reached")
      const dto: CreateTimetableDTO = req.body;
      validateTimetableFormat(dto);
      logger.info(JSON.stringify(dto))
      const created = await this._createrepo.execute(dto);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: RESPONSE_MESSAGES.TIMETABLE_CREATED_SUCCESSFULLY,
        data: created
      });
    } catch (error: unknown) {
      console.log("error solved", error);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: (error as Error).message || "Failed to create timetable",
        error: (error as Error).message
      });
    }
  }



  async GetByClass(req: Request, res: Response): Promise<void> {
    try {
      const { classId, division } = req.params;
      const timetable = await this._gettimetable.execute(classId, division);

      if (!timetable) {
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: RESPONSE_MESSAGES.TIMETABLE_NOT_FOUND });
        return;
      }

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: RESPONSE_MESSAGES.TIMETABLE_FETCHED_SUCCESSFULLY,
        data: timetable,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: RESPONSE_MESSAGES.SOMETHING_WENT_WRONG_1, error });
    }
  }


  async UpdateTimeTable(req: Request, res: Response): Promise<void> {
    try {

      const dto: CreateTimetableDTO = req.body;
      validateTimetableFormat(dto);

      const updated = await this._updatetimetable.execute(dto);
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: RESPONSE_MESSAGES.TIMETABLE_UPDATED_SUCCESSFULLY,
        data: updated
      });
    } catch (error: unknown) {
      console.error("Error updating timetable:", (error as Error).message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message || "Failed to update timetable" });
    }

  }



  async DeleteTimeTable(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.TIMETABLE_ID_IS_REQUIRED });

      await this._deletetimetable.execute(id);
      res.status(StatusCodes.CREATED).json({ message: RESPONSE_MESSAGES.TIMETABLE_DELETED_SUCCESSFULLY });
    } catch (error: unknown) {

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message || "Internal Server Error" });
    }
  }



}