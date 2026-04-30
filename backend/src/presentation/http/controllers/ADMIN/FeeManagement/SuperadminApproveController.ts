import { RESPONSE_MESSAGES } from "../../../../../shared/constants/responseMessages";
import { IApprovalUsecase } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IApprovel";
import { Request,Response } from "express";
import { AuthRequest } from "../../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../../shared/constants/statusCodes";
import { IGetAllPendingStatus } from "../../../../../applications/interface/UseCaseInterface/FeeStructure/IListPendingStatus";


export class SuperadminApprovalController {
    constructor(
        private _approve :IApprovalUsecase,
         private _Getallpendingstatus:IGetAllPendingStatus
    ){}
    

    async approved(req: AuthRequest, res: Response) {
      try {
    const { expenseId, action } = req.body;

    if (!req.user || req.user.role !== "super_admin") {
      return res.status(403).json({
        message: RESPONSE_MESSAGES.ONLY_SUPER_ADMIN_CAN_APPROVE,
      });
    }

    const expense = await this._approve.execute({
      expenseId,
      action,
      approvedBy: req.user.id, 
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Expense ${action.toLowerCase()} successfully`,
      data: expense,
    });
  } catch (error: unknown) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
  }
  }

    async getPendingExpenses(req: AuthRequest, res: Response) {
    try {
       if (!req.user || req.user.role !== "super_admin") {
        console.log("user available here",req.user)
         return res.status(403).json({ message: RESPONSE_MESSAGES.ONLY_SUPER_ADMIN_CAN_ACCESS });
       }
  
      const expenses = await this._Getallpendingstatus.execute();
      res.status(StatusCodes.CREATED).json(expenses);
    } catch (err: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (err as Error).message || "Failed to fetch expenses" });
    }
  }
}
