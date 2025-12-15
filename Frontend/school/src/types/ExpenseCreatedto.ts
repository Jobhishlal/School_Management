import type{ ExpensePaymentMode } from "./ExpensePaymentDto";

export interface ExpenseFormDTO {
  title: string;
  description?: string;
  amount: number;
  expenseDate: string; 
  paymentMode: ExpensePaymentMode;
  createdBy:string
}