import { IVerifyStatusChange } from "../../../domain/UseCaseInterface/Payment/VerifyStatus";
import { IPaymentTransactionRepository } from "../../../domain/repositories/FeeDetails/IPaymentTransactionRepository";
import { PeymentTransactrion } from "../../../domain/entities/FeeType/PaymentTransaction";

export class VerifyPaymentStatus implements IVerifyStatusChange {
  constructor(
    private readonly paymentRepo: IPaymentTransactionRepository
  ) {}


  async execute(
    id: string, 
    payment: PeymentTransactrion
  ): Promise<PeymentTransactrion | null> {
   
    payment.markAsPaid(payment.paymentId!, payment.razorpaySignature);

    const updated = await this.paymentRepo.updatePaymentStatus(id, {
      status: payment.status,
      paymentId: payment.paymentId,
      paidAt: payment.paidAt,
      razorpaySignature: payment.razorpaySignature,
      method: payment.method
    });

    return updated;
  }
}
