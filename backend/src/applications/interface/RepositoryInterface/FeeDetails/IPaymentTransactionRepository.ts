import { PeymentTransactrion } from "../../../../domain/entities/FeeType/PaymentTransaction";
export interface IPaymentTransactionRepository {
  create(txn: PeymentTransactrion): Promise<PeymentTransactrion>;
  findByOrderId(orderId: string): Promise<PeymentTransactrion | null>;
  updateByOrderId(id: string, update: Partial<PeymentTransactrion>): Promise<PeymentTransactrion | null>;
  updatePaymentStatus(id: string, update: Partial<PeymentTransactrion>): Promise<PeymentTransactrion | null>;
  updatePaymentStatusByFeeId(id: string, update: Partial<PeymentTransactrion>): Promise<PeymentTransactrion | null>;
  updateinvoiceurl(paymentId: string, invoiceUrl: string): Promise<void>;
  findById(paymentId: string): Promise<ReturnType<typeof JSON.parse>>;
  getInstitute(): Promise<ReturnType<typeof JSON.parse>>
  findAllPayments(filter: ReturnType<typeof JSON.parse>, page: number, limit: number): Promise<{ payments: ReturnType<typeof JSON.parse>[], total: number }>;
  findAllPayments(filter: ReturnType<typeof JSON.parse>, page: number, limit: number): Promise<{ payments: ReturnType<typeof JSON.parse>[], total: number }>;
  findPaymentsByStudentId(studentId: string, page: number, limit: number): Promise<{ payments: ReturnType<typeof JSON.parse>[], total: number }>;
  getTotalCollectedAmount(): Promise<number>;
}