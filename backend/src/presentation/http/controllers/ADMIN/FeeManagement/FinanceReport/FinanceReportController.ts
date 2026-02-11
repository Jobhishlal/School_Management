import { Request,Response } from "express";
import { IRevenueGenarateUseCase } from "../../../../../../applications/interface/UseCaseInterface/FeeStructure/FinanceReport/IfinanceReport.RevanueUseCase";
import { StatusCodes } from "../../../../../../shared/constants/statusCodes";
import { IExpenseReportGenarate } from "../../../../../../applications/interface/UseCaseInterface/FeeStructure/FinanceReport/IExpenseReportRevenueUseCase";


export class FinanceReportManagementController {
    constructor(
        private readonly revenue:IRevenueGenarateUseCase,
        private readonly expense : IExpenseReportGenarate
    
    ){}

    async RevenueGenerateReport(req:Request,res:Response):Promise<void>{
        try {
            const {startDate,endDate}=req.query
            if(!startDate || !endDate){
              res.status(StatusCodes.BAD_REQUEST)
              .json({message:"start date and end date required",success:false})
            }
            const data = await this.revenue.execute(
                startDate as string,
                endDate as string
            )
               console.log(data)
            res.status(StatusCodes.OK)
            .json({message:"successfully fetched revenue",data,success:true})
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({message:"internal server error",error})
        }
    }

    async ExpenseGenarage(req:Request,res:Response):Promise<void>{
        try {
            const data = await this.expense.execute()
           
            if(!data){
                res.status(StatusCodes.BAD_REQUEST)
                .json({message:"not fetch expense details"})
            }
           
            res.status(StatusCodes.OK)
            .json({message:"expense fetch successfully",data})
        } catch (error) {
           
             res.status(StatusCodes.INTERNAL_SERVER_ERROR)
             .json({message:"internal server error",error})
        }
    }
}