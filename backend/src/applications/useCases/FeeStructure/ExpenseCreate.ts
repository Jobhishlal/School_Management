
import { Expense } from "../../../domain/entities/FeeType/Expense";
import { ExpenseCreateDTO } from "../../dto/FeeDTO/ExpenseDto";
import { IExpenseCreateUseCase } from "../../interface/UseCaseInterface/FeeStructure/IExpenseCreate";
import { IExpenseRepository } from "../../../domain/repositories/FeeDetails/IExpesnseRepositoy";



export class ExpenseCreate implements IExpenseCreateUseCase {
   constructor(private expenseRepo: IExpenseRepository) { }

   async execute(data: ExpenseCreateDTO): Promise<Expense> {
      const expense = new Expense(
         "",
         data.title,
         data.description || "",
         data.amount,
         data.expenseDate,
         data.paymentMode,
         "PENDING",
         data.createdBy,
         undefined,
         new Date(),
         new Date()
      )

      return await this.expenseRepo.create(expense)
   }

}
