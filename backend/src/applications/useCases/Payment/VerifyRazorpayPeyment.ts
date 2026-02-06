import { IVerifyStatusChange } from "../../../domain/UseCaseInterface/Payment/VerifyStatus";
import { IPaymentTransactionRepository } from "../../../domain/repositories/FeeDetails/IPaymentTransactionRepository";
import { PeymentTransactrion } from "../../../domain/entities/FeeType/PaymentTransaction";
import { NotificationPort } from "../../ports/NotificationPort";

export class VerifyPaymentStatus implements IVerifyStatusChange {
  constructor(
    private readonly paymentRepo: IPaymentTransactionRepository,
    private readonly notificationPort: NotificationPort
  ) { }


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

    // Send payment success notification to parent
    if (updated) {
      await this.notificationPort.send({
        title: "Payment Successful",
        content: `Your payment of ₹${updated.amount} has been received successfully.`,
        type: "PAYMENT",
        scope: "GLOBAL",
        classes: [],
        link: "/parent/finance"
      });
    }

    return updated;
  }
}
