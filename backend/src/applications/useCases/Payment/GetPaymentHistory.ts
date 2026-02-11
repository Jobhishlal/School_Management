import { IGetPaymentHistory } from "../../interface/UseCaseInterface/Payment/IGetPaymentHistory";
import { IPaymentTransactionRepository } from "../../../domain/repositories/FeeDetails/IPaymentTransactionRepository";

export class GetPaymentHistory implements IGetPaymentHistory {
    constructor(private readonly paymentRepo: IPaymentTransactionRepository) { }

    async execute(filter: any, page: number, limit: number): Promise<{ payments: any[]; total: number }> {
        return this.paymentRepo.findAllPayments(filter, page, limit);
    }
}
