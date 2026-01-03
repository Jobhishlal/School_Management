import { ExpenseModel,IExpense } from "../../database/models/FeeManagement/Expense";
import { IExpenseRepository } from "../../../domain/repositories/FeeDetails/IExpesnseRepositoy";
import { Expense } from "../../../domain/entities/FeeType/Expense";

export class MongoExpenseManagement implements IExpenseRepository{
    async create(expense: Expense): Promise<Expense> {
        const created = await ExpenseModel.create(
            {
                title:expense.title,
                description:expense.description,
                amount: expense.amount,
                 expenseDate: expense.expenseDate,
                 paymentMode: expense.paymentMode,
                 status: expense.status,
                 createdBy: expense.createdBy,
            }
        )

         return new Expense(
      created.id,
      created.title,
      created.description||"",
      created.amount,
      created.expenseDate,
      created.paymentMode,
      created.status,
      created.createdBy ? created.createdBy.toString() : "", 
      created.approvedBy?.toString(),
      created.createdAt,
      created.updatedAt
      );
    }

    async findById(id: string) {
     const doc = await ExpenseModel.findById(id);
      if (!doc) return null;

     return new Expense(
       doc.id,
    doc.title,
    doc.description || "",
    doc.amount,
    doc.expenseDate,
    doc.paymentMode,
    doc.status,
    doc.createdBy,
    doc.approvedBy,
    doc.createdAt,
    doc.updatedAt
  );
}

    async findByStatus(status: string): Promise<Expense[]> {
        const expense = await ExpenseModel.find({status})
        return expense.map(e=>new Expense(
      e.id,
      e.title,
      e.description || "",
      e.amount,
      e.expenseDate,
      e.paymentMode,
      e.status,
      e.createdBy.toString(),
      e.approvedBy?.toString(),
      e.createdAt,
      e.updatedAt
        ))
    }

    async updateStatus(expenseId: string, status: "APPROVED" | "REJECTED", approvedBy: string): Promise<Expense> {
        const updated = await ExpenseModel.findByIdAndUpdate(
          expenseId,
          {
           status,
           approvedBy,
           },
          { new: true }
          );

          if(!updated){
            throw new Error("Status update not possible")
          }

          return new Expense(
            updated.id,
            updated.title,
            updated.description || "",
            updated.amount,
            updated.expenseDate,
            updated.paymentMode,
            updated.status,
            updated.createdBy.toString(),
            updated.approvedBy?.toString(),
            updated.createdAt,
            updated.updatedAt
          )
    }
    async findAll(): Promise<Expense[]> {
         const expenses = await ExpenseModel.find().sort({ createdAt: -1 });

         return expenses.map(e => new Expense(
         e.id,
         e.title,
         e.description || "",
         e.amount,
         e.expenseDate,
         e.paymentMode,
         e.status,
         e.createdBy,
         e.approvedBy?.toString(),
         e.createdAt,
         e.updatedAt
         ));
    }
   
      async updateIfPending(expenseId: string, data: Partial<Expense>): Promise<Expense | null> {
      const updated = await ExpenseModel.findOneAndUpdate(
    {
      _id: expenseId,
      status: "PENDING", 
    },
    {
      $set: data,
    },
    {
      new: true,
    }
  );

  if (!updated) return null;

  return new Expense(
    updated.id,
    updated.title,
    updated.description || "",
    updated.amount,
    updated.expenseDate,
    updated.paymentMode,
    updated.status,
    updated.createdBy,
    updated.approvedBy?.toString(),
    updated.createdAt,
    updated.updatedAt
      );
     }
}
