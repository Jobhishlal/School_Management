import { RESPONSE_MESSAGES } from "../../../../../../shared/constants/responseMessages";
import { Request,Response } from "express";
import { IRevenueGenarateUseCase } from "../../../../../../applications/interface/UseCaseInterface/FeeStructure/FinanceReport/IfinanceReport.RevanueUseCase";
import { StatusCodes } from "../../../../../../shared/constants/statusCodes";
import { IExpenseReportGenarate } from "../../../../../../applications/interface/UseCaseInterface/FeeStructure/FinanceReport/IExpenseReportRevenueUseCase";


export class FinanceReportManagementController {
    constructor(
        private readonly _revenue:IRevenueGenarateUseCase,
        private readonly _expense : IExpenseReportGenarate
    
    ){}

    async RevenueGenerateReport(req:Request,res:Response):Promise<void>{
        try {
            const {startDate,endDate}=req.query
            if(!startDate || !endDate){
              res.status(StatusCodes.BAD_REQUEST)
              .json({message: RESPONSE_MESSAGES.START_DATE_AND_END_DATE_REQUIRED,success:false})
            }
            const data = await this._revenue.execute(
                startDate as string,
                endDate as string
            )
               console.log(data)
            res.status(StatusCodes.OK)
            .json({message: RESPONSE_MESSAGES.SUCCESSFULLY_FETCHED_REVENUE,data,success:true})
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_1,error})
        }
    }

    async ExpenseGenarage(req:Request,res:Response):Promise<void>{
        try {
            const data = await this._expense.execute()
           
            if(!data){
                res.status(StatusCodes.BAD_REQUEST)
                .json({message: RESPONSE_MESSAGES.NOT_FETCH_EXPENSE_DETAILS})
            }
           
            res.status(StatusCodes.OK)
            .json({message: RESPONSE_MESSAGES.EXPENSE_FETCH_SUCCESSFULLY,data})
        } catch (error) {
           
             res.status(StatusCodes.INTERNAL_SERVER_ERROR)
             .json({message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_1,error})
        }
    }
}