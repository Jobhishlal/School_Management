export interface StudentPaymentStatus {
  studentId: string;
  studentName: string;
  totalPaid: number;
  totalAmount: number;
  paymentStatus: "COMPLETED" | "PENDING";
}