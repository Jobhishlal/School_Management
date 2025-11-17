export interface ICreateRazorpayOrder {
  execute(data: {
    amount: number;
    currency?: string;
    studentId: string;
    feeRecordId: string;
    method?: string;
  }): Promise<{
    id: string;
    amount: number;
    currency: string;
  }>;
}
