

import { ExpenseApproveDTO } from "../../../dto/FeeDTO/ExpenseApproveDTO";
import { Expense } from "../../../../domain/entities/FeeType/Expense";

export interface IApprovalUsecase{
    execute(data:ExpenseApproveDTO):Promise<Expense>
}