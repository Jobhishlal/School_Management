

import { ExpenseApproveDTO } from "../../../dto/FeeDTO/ExpenseApproveDTO";
import { Expense } from "../../entities/FeeType/Expense";

export interface IApprovalUsecase{
    execute(data:ExpenseApproveDTO):Promise<Expense>
}