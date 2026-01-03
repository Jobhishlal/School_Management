import { ExpensePaymentMode } from "../../../domain/enums/FeeStructure/ExpensePaymentMode";

export interface ExpenseCreateDTO{
  title: string;
  description?: string;
  amount: number;
  expenseDate: Date;
  paymentMode: ExpensePaymentMode;
  createdBy: string;
}