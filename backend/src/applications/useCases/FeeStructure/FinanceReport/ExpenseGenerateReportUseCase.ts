import { IExpenseReportGenarate } from "../../../interface/UseCaseInterface/FeeStructure/FinanceReport/IExpenseReportRevenueUseCase";
import { ExpenseReportInterface } from "../../../../domain/repositories/FeeDetails/FinanceReport/IExpenseReport";
import { ExpenseReport } from "../../../dto/FeeDTO/financeReport/ExpenseReport";


 export class ExpenseReportUseCase implements IExpenseReportGenarate{
    constructor(private repo : ExpenseReportInterface){}

     async execute(): Promise<ExpenseReport> {
         const data = await this.repo.findAllExpense()
         return data
     }


    
 }