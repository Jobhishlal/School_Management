import { ExpenseReport } from "../../../../dto/FeeDTO/financeReport/ExpenseReport";

export interface ExpenseReportInterface {
  findAllExpense(
   
  ): Promise<ExpenseReport>;
}