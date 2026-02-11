import { Request, Response } from "express";
import { ITypeCreateUseCase } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IFeeTypeCreate";
import { CreateFeeTypeDTO } from "../../../../../applications/dto/FeeDTO/CreateFeeTypeDTO";
import { IGetAllFeeType } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IGetAllFeeType";
import { StatusCodes } from "../../../../../shared/constants/statusCodes";

import { FeeTypeValidationfunction } from "../../../../validators/FeeStructureValidation/CreateValidationFeeStructure";

export class FeeTypeCreateController {
  constructor(
    private createFeeTypeUseCase: ITypeCreateUseCase,
    private getAllFeeTypeUseCase: IGetAllFeeType
  ) { }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const payload: CreateFeeTypeDTO = req.body;
      console.log("FeeType creation request received:", payload);

      FeeTypeValidationfunction(payload);

      const createdFeeType = await this.createFeeTypeUseCase.execute(payload);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Fee Type created successfully",
        data: createdFeeType,
      });

      console.log("FeeType created successfully:", createdFeeType.name);
    } catch (error: any) {
      console.log("error", error)
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllFeeTypes(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.getAllFeeTypeUseCase.execute();

      if (!data || data.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "No fee types found",
        });
        return;
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Fee types fetched successfully",
        data,
      });
    } catch (error: any) {

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to get fee types",
        error: error.message,
      });
    }
  }
}
