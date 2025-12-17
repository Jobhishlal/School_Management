import { ExpenseModel } from "../../../database/models/FeeManagement/Expense";
import { ExpenseReportInterface } from "../../../../domain/repositories/FeeDetails/FinanceReport/IExpenseReport";
import { ExpenseReport } from "../../../../applications/dto/FeeDTO/financeReport/ExpenseReport";


export class MongoExpenseReport implements ExpenseReportInterface{

     async findAllExpense(): Promise<ExpenseReport> {
         const monthlyexpense = await ExpenseModel.aggregate([
           {
             $group: {
               _id: {
                month: { $month: "$expenseDate" },
                  year: { $year: "$expenseDate" },
               },
                totalAmount: { $sum: "$amount" },
              },
              },

              {
                $sort: { "_id.year": 1, "_id.month": 1 },
               },

               {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                months: [
                  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ]
              },
              in: {
                $arrayElemAt: ["$$months", "$_id.month"]
              }
            }
               },
            totalAmount: 1,
            },
           },
         ])

         const totalExpense = await ExpenseModel.aggregate([
            {
            $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

     const approvedExpense = await ExpenseModel.aggregate([
      {
        $match: { status: "APPROVED" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

     const pendingExpense = await ExpenseModel.aggregate([
      {
        $match: { status: "PENDING" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);


     return {
      totalExpense: totalExpense[0]?.total || 0,
      approvedExpense: approvedExpense[0]?.total || 0,
      pendingExpense: pendingExpense[0]?.total || 0,
      monthlyexpense,
    };

     }
}