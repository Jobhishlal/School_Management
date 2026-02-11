import { Expense } from "../../../../domain/entities/FeeType/Expense";


export interface IGetAllPendingStatus{
    execute():Promise<Expense[]>
}