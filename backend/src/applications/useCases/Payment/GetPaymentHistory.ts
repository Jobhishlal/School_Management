import { IGetPaymentHistory } from "../../interface/UseCaseInterface/Payment/IGetPaymentHistory";
import { IPaymentTransactionRepository } from "../../interface/RepositoryInterface/FeeDetails/IPaymentTransactionRepository";

export class GetPaymentHistory implements IGetPaymentHistory {
    constructor(private readonly paymentRepo: IPaymentTransactionRepository) { }

    async execute(filter: ReturnType<typeof JSON.parse>, page: number, limit: number): Promise<{ payments: ReturnType<typeof JSON.parse>[]; total: number }> {
        return this.paymentRepo.findAllPayments(filter, page, limit);
    }
}
