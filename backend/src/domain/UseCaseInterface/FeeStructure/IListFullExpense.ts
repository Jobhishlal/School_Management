
import { Expense } from "../../entities/FeeType/Expense";

export interface IExpenseFUllListout {
  execute(): Promise<Expense[]>;
}
