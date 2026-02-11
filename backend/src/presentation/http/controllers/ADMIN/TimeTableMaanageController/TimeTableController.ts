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
    private readonly createrepo: ICreateTimeTable,
    private readonly gettimetable: IGETTIMETABLECLASS,
    private readonly updatetimetable: IUPDATETIMETABLE,
    private readonly deletetimetable: IDeleteTimeTable,


  ) { }

  async createTimetable(req: Request, res: Response): Promise<void> {
    try {
      console.log("i am reached")
      const dto: CreateTimetableDTO = req.body;
      validateTimetableFormat(dto);
      logger.info(JSON.stringify(dto))
      const created = await this.createrepo.execute(dto);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Timetable created successfully",
        data: created
      });
    } catch (error: any) {
      console.log("error solved", error);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to create timetable",
        error: error.message
      });
    }
  }



  async GetByClass(req: Request, res: Response): Promise<void> {
    try {
      const { classId, division } = req.params;
      const timetable = await this.gettimetable.execute(classId, division);

      if (!timetable) {
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Timetable not found" });
        return;
      }

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Timetable fetched successfully",
        data: timetable,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Something went wrong", error });
    }
  }


  async UpdateTimeTable(req: Request, res: Response): Promise<void> {
    try {

      const dto: CreateTimetableDTO = req.body;
      validateTimetableFormat(dto);

      const updated = await this.updatetimetable.execute(dto);
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Timetable updated successfully",
        data: updated
      });
    } catch (error: any) {
      console.error("Error updating timetable:", error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Failed to update timetable" });
    }

  }



  async DeleteTimeTable(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) res.status(StatusCodes.BAD_REQUEST).json({ message: "Timetable ID is required" });

      await this.deletetimetable.execute(id);
      res.status(StatusCodes.CREATED).json({ message: "Timetable deleted successfully" });
    } catch (error: any) {

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Internal Server Error" });
    }
  }



}