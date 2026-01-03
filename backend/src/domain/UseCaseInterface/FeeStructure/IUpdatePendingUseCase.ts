
import { Expense } from "../../entities/FeeType/Expense";
import { UpdatePendingExpenseDTO } from "../../../applications/dto/FeeDTO/UpdatePendingExpenseDTO";

export interface IUpdatePendingExpense {
  execute(dto: UpdatePendingExpenseDTO): Promise<Expense>;
}
