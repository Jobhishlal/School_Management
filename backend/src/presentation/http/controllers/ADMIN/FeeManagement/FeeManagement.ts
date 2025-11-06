import { Request, Response } from "express";
import { ICreateFeeStructureUseCase } from "../../../../../domain/UseCaseInterface/FeeStructure/IFeeCreateInterFace";

export class FeeStructureManageController {
  constructor(private createFeeUseCase: ICreateFeeStructureUseCase) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, classId, academicYear, feeItems, notes } = req.body;

      if (!name || !classId || !academicYear || !feeItems) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }


      const result = await this.createFeeUseCase.execute({
        name,
        classId,
        academicYear,
        feeItems,
        notes,
      });

   
      res.status(201).json({
        message: "Fee Structure created successfully",
        data: result,
      });

    } catch (error: any) {
      console.log("error",error)
      res.status(500).json({
        message: "Failed to create fee structure",
        error: error.message,
      });
    }
  }
}
