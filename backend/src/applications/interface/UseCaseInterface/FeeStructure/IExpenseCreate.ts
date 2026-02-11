
import { ExpenseCreateDTO } from "../../../dto/FeeDTO/ExpenseDto";
import { Expense } from "../../../../domain/entities/FeeType/Expense";


export interface IExpenseCreateUseCase{
    execute(data:ExpenseCreateDTO):Promise<Expense>
}