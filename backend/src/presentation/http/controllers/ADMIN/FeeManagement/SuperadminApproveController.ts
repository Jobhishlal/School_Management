import { IApprovalUsecase } from "../../../../../domain/UseCaseInterface/FeeStructure/IApprovel";
import { Request,Response } from "express";
import { AuthRequest } from "../../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../../shared/constants/statusCodes";
import { IGetAllPendingStatus } from "../../../../../domain/UseCaseInterface/FeeStructure/IListPendingStatus";


export class SuperadminApprovalController {
    constructor(
        private approve :IApprovalUsecase,
         private Getallpendingstatus:IGetAllPendingStatus
    ){}
    

    async approved(req: AuthRequest, res: Response) {
      try {
    const { expenseId, action } = req.body;

    if (!req.user || req.user.role !== "super_admin") {
      return res.status(403).json({
        message: "Only super admin can approve",
      });
    }

    const expense = await this.approve.execute({
      expenseId,
      action,
      approvedBy: req.user.id, 
    });

    return res.status(200).json({
      success: true,
      message: `Expense ${action.toLowerCase()} successfully`,
      data: expense,
    });
  } catch (error: any) {
    console.log(error)
    return res.status(400).json({ message: error.message });
  }
  }

    async getPendingExpenses(req: AuthRequest, res: Response) {
    try {
       if (!req.user || req.user.role !== "super_admin") {
        console.log("user available here",req.user)
         return res.status(403).json({ message: "Only super admin can access" });
       }
  
      const expenses = await this.Getallpendingstatus.execute();
      res.status(StatusCodes.CREATED).json(expenses);
    } catch (err: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message || "Failed to fetch expenses" });
    }
  }
}
