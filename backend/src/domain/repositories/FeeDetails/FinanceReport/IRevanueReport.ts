import { RevanueReport } from "../../../../applications/dto/FeeDTO/financeReport/RevenueReport";

export interface IRevenueGenerateRepository {
  findAllRevenue(
    startDate: Date,
    endDate: Date
  ): Promise<RevanueReport>;
}