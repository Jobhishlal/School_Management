import { Request, Response } from "express";
import { ICreateFeeStructureUseCase } from "../../../../../domain/UseCaseInterface/FeeStructure/IFeeCreateInterFace";
import { StatusCodes } from "../../../../../shared/constants/statusCodes";
export class FeeStructureManageController {
  constructor(private createFeeUseCase: ICreateFeeStructureUseCase) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, classId, academicYear, feeItems, notes } = req.body;

      if (!name || !classId || !academicYear || !feeItems) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing required fields" });
        return;
      }


      const result = await this.createFeeUseCase.execute({
        name,
        classId,
        academicYear,
        feeItems,
        notes,
      });

   
      res.status(StatusCodes.CREATED).json({
        message: "Fee Structure created successfully",
        data: result,
      });

    } catch (error: any) {
      console.log("error happend",error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create fee structure",
        error: error.message,
      });
    }
  }
}
