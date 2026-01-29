import { PeymentTransactrion } from "../../entities/FeeType/PaymentTransaction";

export interface IPaymentTransactionRepository {
  create(txn: PeymentTransactrion): Promise<PeymentTransactrion>;
  findByOrderId(orderId: string): Promise<PeymentTransactrion | null>;
  updateByOrderId(id: string, update: Partial<PeymentTransactrion>): Promise<PeymentTransactrion | null>;
  updatePaymentStatus(id: string, update: Partial<PeymentTransactrion>): Promise<PeymentTransactrion | null>;
  updatePaymentStatusByFeeId(id: string, update: Partial<PeymentTransactrion>): Promise<PeymentTransactrion | null>;
  updateinvoiceurl(paymentId: string, invoiceUrl: string): Promise<void>;
  findById(paymentId: string): Promise<any>;
  getInstitute(): Promise<any>
  findAllPayments(filter: any, page: number, limit: number): Promise<{ payments: any[], total: number }>;
  findAllPayments(filter: any, page: number, limit: number): Promise<{ payments: any[], total: number }>;
  findPaymentsByStudentId(studentId: string, page: number, limit: number): Promise<{ payments: any[], total: number }>;
  getTotalCollectedAmount(): Promise<number>;
}