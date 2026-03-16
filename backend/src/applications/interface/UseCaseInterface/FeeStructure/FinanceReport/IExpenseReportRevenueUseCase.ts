import { ExpenseReport } from "../../../../dto/FeeDTO/financeReport/ExpenseReport";

export interface IExpenseReportGenarate{
    execute():Promise<ExpenseReport>
}