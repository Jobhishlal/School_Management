import { IGetParentPaymentHistory } from "../../interface/UseCaseInterface/Payment/IGetParentPaymentHistory";
import { IPaymentTransactionRepository } from "../../../domain/repositories/FeeDetails/IPaymentTransactionRepository";

export class GetParentPaymentHistory implements IGetParentPaymentHistory {
    constructor(private readonly paymentRepo: IPaymentTransactionRepository) { }

    async execute(studentId: string, page: number, limit: number): Promise<{ payments: any[]; total: number }> {
        return this.paymentRepo.findPaymentsByStudentId(studentId, page, limit);
    }
}
