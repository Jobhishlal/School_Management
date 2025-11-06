import { PeymentTransactrion } from "../../entities/FeeType/PaymentTransaction";

export interface IPaymentTransactionRepository {
  create(txn: PeymentTransactrion): Promise<PeymentTransactrion>;
  findByOrderId(orderId: string): Promise<PeymentTransactrion | null>;
  findById(id: string): Promise<PeymentTransactrion | null>;
  update(id: string, update: Partial<PeymentTransactrion>): Promise<PeymentTransactrion | null>;
}