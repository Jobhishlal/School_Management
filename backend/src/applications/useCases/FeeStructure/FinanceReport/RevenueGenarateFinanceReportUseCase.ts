import { IRevenueGenarateUseCase } from "../../../interface/UseCaseInterface/FeeStructure/FinanceReport/IfinanceReport.RevanueUseCase";
import { RevanueReport } from "../../../dto/FeeDTO/financeReport/RevenueReport";
import { IRevenueGenerateRepository } from "../../../interface/RepositoryInterface/FeeDetails/FinanceReport/IRevanueReport";

export class FinanceReportUseCase implements IRevenueGenarateUseCase {

  constructor(
    private readonly repo: IRevenueGenerateRepository
  ) {}

  async execute(
    startDate: string,
    endDate: string
  ): Promise<RevanueReport> {

    if (!startDate || !endDate) {
      throw new Error("DATE_RANGE_REQUIRED");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("INVALID_DATE_FORMAT");
    }

    return this.repo.findAllRevenue(start, end);
  }
}