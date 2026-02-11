
import { Expense } from "../../../domain/entities/FeeType/Expense";
import { IExpenseRepository } from "../../interface/RepositoryInterface/FeeDetails/IExpesnseRepositoy";
import { IExpenseFUllListout } from "../../interface/UseCaseInterface/FeeStructure/IListFullExpense";


export class ListOutFullExpense implements IExpenseFUllListout{
    constructor(private repo : IExpenseRepository){}

    async execute(): Promise<Expense[]> {
    return await this.repo.findAll();
  }
}

