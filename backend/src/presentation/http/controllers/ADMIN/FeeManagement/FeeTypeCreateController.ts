import { RESPONSE_MESSAGES } from "../../../../../shared/constants/responseMessages";
import { Request, Response } from "express";
import { ITypeCreateUseCase } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IFeeTypeCreate";
import { CreateFeeTypeDTO } from "../../../../../applications/dto/FeeDTO/CreateFeeTypeDTO";
import { IGetAllFeeType } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IGetAllFeeType";
import { StatusCodes } from "../../../../../shared/constants/statusCodes";

import { validateFeeTypeCreate } from "../../../../validators/FinanceValidation/FinanceValidators";

export class FeeTypeCreateController {
  constructor(
    private _createFeeTypeUseCase: ITypeCreateUseCase,
    private _getAllFeeTypeUseCase: IGetAllFeeType
  ) { }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const payload: CreateFeeTypeDTO = req.body;
      console.log("FeeType creation request received:", payload);

      validateFeeTypeCreate(payload);

      const createdFeeType = await this._createFeeTypeUseCase.execute(payload);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: RESPONSE_MESSAGES.FEE_TYPE_CREATED_SUCCESSFULLY,
        data: createdFeeType,
      });

      console.log("FeeType created successfully:", createdFeeType.name);
    } catch (error: unknown) {
      console.log("error", error)
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async getAllFeeTypes(req: Request, res: Response): Promise<void> {
    try {
      const data = await this._getAllFeeTypeUseCase.execute();

      if (!data || data.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: RESPONSE_MESSAGES.NO_FEE_TYPES_FOUND,
        });
        return;
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.FEE_TYPES_FETCHED_SUCCESSFULLY,
        data,
      });
    } catch (error: unknown) {

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: RESPONSE_MESSAGES.FAILED_TO_GET_FEE_TYPES,
        error: (error as Error).message,
      });
    }
  }
}
