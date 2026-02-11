
import { Expense } from "../../../../domain/entities/FeeType/Expense";

export interface IExpenseFUllListout {
  execute(): Promise<Expense[]>;
}
