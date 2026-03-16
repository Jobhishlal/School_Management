import { RevanueReport } from "../../../../dto/FeeDTO/financeReport/RevenueReport";

export interface IRevenueGenarateUseCase{
    execute(startDate:string,endDate:string):Promise<RevanueReport>
}