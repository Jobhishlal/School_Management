import { Expense } from "../../../../domain/entities/FeeType/Expense";

export interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>
  findAll(): Promise<Expense[]>
  findById(id: string): Promise<Expense | null>

  findByStatus(status: string): Promise<Expense[]>;
  updateStatus(
    expenseId: string,
    status: "APPROVED" | "REJECTED",
    approvedBy: string
  ): Promise<Expense>;
  updateIfPending(expenseId: string, data: Partial<Expense>): Promise<Expense | null>;
  getTotalApprovedAmount(): Promise<number>;
}