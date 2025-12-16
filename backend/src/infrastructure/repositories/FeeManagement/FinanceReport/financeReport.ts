import { PaymentModel } from "../../../database/models/FeeManagement/Payment";
import { IRevenueGenerateRepository } from "../../../../domain/repositories/FeeDetails/FinanceReport/IRevanueReport";
import { RevanueReport } from "../../../../applications/dto/FeeDTO/financeReport/RevenueReport";


export class MongoRevenueGenarateReport  implements IRevenueGenerateRepository{

    async findAllRevenue(startDate: Date, endDate: Date): Promise<RevanueReport> {
         const matchStage = {
      paymentDate: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $in: ["PAID", "PENDING"] }
    };

    const result = await PaymentModel.aggregate([
      { $match: matchStage },

      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" },
                paidRevenue: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "PAID"] }, "$amount", 0]
                  }
                },
                pendingRevenue: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "PENDING"] }, "$amount", 0]
                  }
                }
              }
            }
          ],

          monthlyRevenue: [
            {
              $group: {
                _id: { $month: "$paymentDate" },
                totalAmount: { $sum: "$amount" }
              }
            },
            { $sort: { "_id": 1 } }
          ]
        }
      }
    ]);

    const summary = result[0]?.summary[0] || {
      totalRevenue: 0,
      paidRevenue: 0,
      pendingRevenue: 0
    };

    const monthlyRevenue = (result[0]?.monthlyRevenue || []).map((m: any) => ({
      month: this.getMonthName(m._id),
      totalAmount: m.totalAmount
    }));

    return {
      totalRevenue: summary.totalRevenue,
      PaidRevenue: summary.paidRevenue,
      pendingRevenue: summary.pendingRevenue,
      monthlyRevenue
    };
  }

  private getMonthName(month: number): string {
    return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month - 1];
  }
    }
