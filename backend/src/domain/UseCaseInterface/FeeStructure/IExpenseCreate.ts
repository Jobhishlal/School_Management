
import { ExpenseCreateDTO } from "../../../applications/dto/FeeDTO/ExpenseDto";
import { Expense } from "../../entities/FeeType/Expense";


export interface IExpenseCreateUseCase{
    execute(data:ExpenseCreateDTO):Promise<Expense>
}