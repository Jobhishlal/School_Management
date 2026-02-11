import { RevanueReport } from "../../../../dto/FeeDTO/financeReport/RevenueReport";

export interface IRevenueGenerateRepository {
  findAllRevenue(
    startDate: Date,
    endDate: Date
  ): Promise<RevanueReport>;
}