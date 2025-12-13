
export class PeymentTransactrion {
  constructor(
    public readonly id: string,
    public studentId: string,
    public feeRecordId: string,
    public orderId: string,
    public paymentId: string | null,
    public amount: number,
    public status: "PENDING" | "PAID" | "FAILED" | "REFUNDED",
    public createdAt: Date,
    public paidAt?: Date,
    public method?: string,
    public razorpaySignature?: string,
    public invoiceUrl ?:string
  ) {}

  markAsPaid(paymentId: string, signature?: string) {
    this.status = "PAID";
    this.paymentId = paymentId;
    this.paidAt = new Date();
    this.razorpaySignature = signature;
  }

  markAsFailed() {
    this.status = "FAILED";
  }
}
