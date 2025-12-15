import { IApprovalUsecase } from "../../../domain/UseCaseInterface/FeeStructure/IApprovel";
import { IExpenseRepository } from "../../../domain/repositories/FeeDetails/IExpesnseRepositoy";
import { Expense } from "../../../domain/entities/FeeType/Expense";
import { ExpenseApproveDTO } from "../../dto/FeeDTO/ExpenseApproveDTO";

export class ExpenseApproveUseCase implements IApprovalUsecase {
  constructor(private repo: IExpenseRepository) {}

  async execute(data: ExpenseApproveDTO): Promise<Expense> {
    const expense = await this.repo.findById(data.expenseId);

    if (!expense) {
      throw new Error("Expense not found");
    }

    if (expense.status !== "PENDING") {
      throw new Error("Expense already approved or rejected");
    }

    return await this.repo.updateStatus(
      data.expenseId,
      data.action,
      data.approvedBy
    );
  }
}
