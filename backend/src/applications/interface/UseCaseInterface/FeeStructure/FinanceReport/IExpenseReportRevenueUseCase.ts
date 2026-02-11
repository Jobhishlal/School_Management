import { ExpenseReport } from "../../../../applications/dto/FeeDTO/financeReport/ExpenseReport";

export interface IExpenseReportGenarate{
    execute():Promise<ExpenseReport>
}