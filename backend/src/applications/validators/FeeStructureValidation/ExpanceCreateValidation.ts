import { ExpensePaymentMode } from "../../../domain/enums/FeeStructure/ExpensePaymentMode";
import { ExpenseCreateDTO } from "../../dto/FeeDTO/ExpenseDto";
import { ExpenseValidation } from "../../../domain/enums/FeeStructure/ExpenseValidation ";

export const ExpenceReletedvalidation=(data:ExpenseCreateDTO)=>{
   if (
    !data.title ||
    data.amount === undefined ||
    !data.expenseDate ||
    !data.paymentMode ||
    !data.createdBy
  ) {
    throw new Error(ExpenseValidation.ALL_FIELDS_REQUIRED);
  }
  if (typeof data.title !== "string" || data.title.trim().length < 10) {
    throw new Error(ExpenseValidation.INVALID_TITLE);
  }
   if (typeof data.amount !== "number" || data.amount <= 0) {
    throw new Error(ExpenseValidation.INVALID_AMOUNT);
  }
   const expenseDate = new Date(data.expenseDate);
  if (isNaN(expenseDate.getTime())) {
    throw new Error(ExpenseValidation.INVALID_DATE);
  }
   const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (expenseDate > today) {
    throw new Error(ExpenseValidation.FUTURE_DATE_NOT_ALLOWED);
  }
    if (!Object.values(ExpensePaymentMode).includes(data.paymentMode)) {
    throw new Error(ExpenseValidation.INVALID_PAYMENT_MODE);
  }
  if (typeof data.createdBy !== "string" || data.createdBy.trim() === "") {
    throw new Error(ExpenseValidation.INVALID_CREATED_BY);
  }

  return true;
}