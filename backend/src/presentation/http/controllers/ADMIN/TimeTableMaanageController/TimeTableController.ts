import { StatusCodes } from "../../../../../shared/constants/statusCodes";
import { ICreateTimeTable } from "../../../../../domain/UseCaseInterface/TimeTable/ICreateTimeTable";
import { IGETTIMETABLECLASS } from "../../../../../domain/UseCaseInterface/TimeTable/IGetTimeTableClassUseCase";
import { IDeleteTimeTable } from "../../../../../domain/UseCaseInterface/TimeTable/IDeleteTimeTableUseCase";
import { IUPDATETIMETABLE } from "../../../../../domain/UseCaseInterface/TimeTable/IUpdateTimeTable";


import { CreateTimetableDTO } from "../../../../../applications/dto/CreateTImeTableDTO";
import { Request,Response } from "express";
import logger from "../../../../../shared/constants/Logger";


export class TimeTableManageController{
    constructor(
        private readonly createrepo:ICreateTimeTable,
        private readonly gettimetable:IGETTIMETABLECLASS,
        private readonly updatetimetable:IUPDATETIMETABLE,
        private readonly deletetimetable:IDeleteTimeTable,
        

    ){}

     async createTimetable(req: Request, res: Response): Promise<void> {
     try {
        console.log("i am reached")
    const dto: CreateTimetableDTO = req.body;
    logger.info(JSON.stringify(dto))
    const created = await this.createrepo.execute(dto);
    console.log("created ")
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Timetable created successfully",
      data: created
    });
    } catch (error) {
      console.log("error solved",error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : error
       });
      }
   }



async GetByClass(req: Request, res: Response): Promise<void> {
  try {
    const { classId, division } = req.params;
    const timetable = await this.gettimetable.execute(classId, division);

    if (!timetable) {
      res.status(404).json({ success: false, message: "Timetable not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Timetable fetched successfully",
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong", error });
  }
}


async UpdateTimeTable(req: Request, res: Response): Promise<void> {
    try {
      console.log("reached update")
        const dto: CreateTimetableDTO = req.body;
        console.log("i am reached here",dto)
        const updated = await this.updatetimetable.execute(dto);
        res.status(200).json({
            success: true,
            message: "Timetable updated successfully",
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}



async DeleteTimeTable(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!id)  res.status(400).json({ message: "Timetable ID is required" });

    await this.deletetimetable.execute(id);
    res.status(StatusCodes.OK).json({ message: "Timetable deleted successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
}


}