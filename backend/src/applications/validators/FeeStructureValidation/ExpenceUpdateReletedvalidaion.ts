import { UpdatePendingExpenseDTO } from "../../dto/FeeDTO/UpdatePendingExpenseDTO";
import { ExpenseValidation } from "../../../domain/enums/FeeStructure/ExpenseValidation ";
import { ExpensePaymentMode } from "../../../domain/enums/FeeStructure/ExpensePaymentMode";

export function UpdateExpenseReletedValidation(data: UpdatePendingExpenseDTO["data"]) {

  if (data.title !== undefined) {
    if (typeof data.title !== "string" || data.title.trim().length < 3) {
      throw new Error(ExpenseValidation.INVALID_TITLE);
    }
  }

  if (data.amount !== undefined) {
    if (typeof data.amount !== "number" || data.amount <= 0) {
      throw new Error(ExpenseValidation.INVALID_AMOUNT);
    }
  }

  if (data.expenseDate !== undefined) {
    const expenseDate = new Date(data.expenseDate);
    if (isNaN(expenseDate.getTime())) {
      throw new Error(ExpenseValidation.INVALID_DATE);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expenseDate > today) {
      throw new Error(ExpenseValidation.FUTURE_DATE_NOT_ALLOWED);
    }
  }

  if (data.paymentMode !== undefined) {
    if (!Object.values(ExpensePaymentMode).includes(data.paymentMode)) {
      throw new Error(ExpenseValidation.INVALID_PAYMENT_MODE);
    }
  }

  return true;
}
