import { IExpenseRepository } from "../../../domain/repositories/FeeDetails/IExpesnseRepositoy";
import { IGetAllPendingStatus } from "../../interface/UseCaseInterface/FeeStructure/IListPendingStatus";
import { Expense } from "../../../domain/entities/FeeType/Expense";


export class PendingStatusFindUsecase implements IGetAllPendingStatus {
    constructor(private repo : IExpenseRepository){}

        async execute(): Promise<Expense[]> {
             const pendingExpenses = await this.repo.findByStatus("PENDING");
            return pendingExpenses;
        }
}