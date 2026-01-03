import { IParentAttendanceUseCase } from "../../../../domain/UseCaseInterface/Attandance/IParentAttendanceListUseCase";
import { Request,Response } from "express";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class ParentAttendanceListController{
    constructor(private repo:IParentAttendanceUseCase){}
    
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

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}