
import { Expense } from "../../../../domain/entities/FeeType/Expense";
import { UpdatePendingExpenseDTO } from "../../../dto/FeeDTO/UpdatePendingExpenseDTO";

export interface IUpdatePendingExpense {
  execute(dto: UpdatePendingExpenseDTO): Promise<Expense>;
}
