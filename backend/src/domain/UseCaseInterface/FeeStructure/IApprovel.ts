

import { ExpenseApproveDTO } from "../../../applications/dto/FeeDTO/ExpenseApproveDTO";
import { Expense } from "../../entities/FeeType/Expense";

export interface IApprovalUsecase{
    execute(data:ExpenseApproveDTO):Promise<Expense>
}