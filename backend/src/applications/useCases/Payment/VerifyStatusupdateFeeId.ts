import { IPaymentTransactionRepository } from "../../../domain/repositories/FeeDetails/IPaymentTransactionRepository";
import { PeymentTransactrion } from "../../../domain/entities/FeeType/PaymentTransaction";
import { IPaymentStatusUpdateFeID } from "../../interface/UseCaseInterface/Payment/IPaymentStatusUpdatefeeIdbase";

export class VerifyPaymentByFeeId implements IPaymentStatusUpdateFeID{
  constructor(private readonly paymentRepo: IPaymentTransactionRepository) {}

  async execute(feeId: string, payment: PeymentTransactrion): Promise<PeymentTransactrion | null> {
    payment.markAsPaid(payment.paymentId!, payment.razorpaySignature);

    const updated = await this.paymentRepo.updatePaymentStatusByFeeId(feeId, {
      status: payment.status,
      paymentId: payment.paymentId,
      paidAt: payment.paidAt,
      razorpaySignature: payment.razorpaySignature,
      method: payment.method
    });

    return updated;
  }
}
