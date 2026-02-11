

import { Request, Response } from "express";
import { IExpenseCreateUseCase } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IExpenseCreate";

import { StatusCodes } from "../../../../../shared/constants/statusCodes";
import { IGetAllPendingStatus } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IListPendingStatus";
import { AuthRequest } from "../../../../../infrastructure/types/AuthRequest";
import { IExpenseFUllListout } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IListFullExpense";
import { IUpdatePendingExpense } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IUpdatePendingUseCase";
import { UpdatePendingExpenseDTO } from "../../../../../applications/dto/FeeDTO/UpdatePendingExpenseDTO";

import { validateExpenseCreate, validateExpenseUpdate } from "../../../../validators/FinanceValidation/FinanceValidators";

export class ExpenseManagementController {

  constructor(
    private Createexpenseuse: IExpenseCreateUseCase,
    private ExpenseListout: IExpenseFUllListout,
    private Pendingstatusupdate: IUpdatePendingExpense

  ) { }
  async create(req: Request, res: Response): Promise<void> {

    try {
      validateExpenseCreate(req.body);
      const expense = await this.Createexpenseuse.execute(req.body)

      console.log("expense full details", expense)
      res.status(StatusCodes.CREATED)
        .json({
          message: "data create successfully", success: true,
          data: expense
        })
    } catch (error: any) {

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }

  }

  async listAll(req: AuthRequest, res: Response) {
    try {


      const expenses = await this.ExpenseListout.execute();

      return res.status(StatusCodes.OK).json({
        success: true,
        data: expenses,
      });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Internal server error",
      });
    }
  }

  async Pendingexpenseupdate(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        console.log("user", req.user)
        res.status(StatusCodes.FORBIDDEN).json({ message: "does not have user" })
      }
      validateExpenseUpdate(req.body);
      const dto = {
        expenseId: req.params.id,
        data: req.body
      }

      const update = await this.Pendingstatusupdate.execute(dto)
      if (!update) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "pending status does not update", success: false })
      }
      res.status(StatusCodes.OK)
        .json({ message: "expense update successfully ", success: true, update })
    } catch (error: any) {

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}