import { Expense } from "../../entities/FeeType/Expense";


export interface IGetAllPendingStatus{
    execute():Promise<Expense[]>
}