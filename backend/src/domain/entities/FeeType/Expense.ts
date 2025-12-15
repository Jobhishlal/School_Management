import { ExpensePaymentMode } from "../../enums/FeeStructure/ExpensePaymentMode";


export class Expense{
 constructor(
    public id: string,
    public title: string,
    public description: string,
    public amount: number,
    public expenseDate: Date,
    public paymentMode: ExpensePaymentMode,
    public status: "PENDING" | "APPROVED" | "REJECTED",
    public createdBy: string,
    public approvedBy?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {
    if (!title.trim()) {
      throw new Error("Expense title is required");
    }

    if (amount <= 0) {
      throw new Error("Expense amount must be greater than zero");
    }

    if (!expenseDate) {
      throw new Error("Expense date is required");
    }
  }
}