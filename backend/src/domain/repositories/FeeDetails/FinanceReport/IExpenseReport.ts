import { ExpenseReport } from "../../../../applications/dto/FeeDTO/financeReport/ExpenseReport";

export interface ExpenseReportInterface {
  findAllExpense(
   
  ): Promise<ExpenseReport>;
}