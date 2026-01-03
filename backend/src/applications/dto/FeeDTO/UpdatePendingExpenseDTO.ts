import { ExpensePaymentMode } from "../../../domain/enums/FeeStructure/ExpensePaymentMode";
export interface UpdatePendingExpenseDTO {
  expenseId: string;
  data: {
    title?: string;
    description?: string;
    amount?: number;
    expenseDate?: Date;
    paymentMode?: ExpensePaymentMode;
  };
}