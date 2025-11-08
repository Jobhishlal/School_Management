
export interface ICreateRazorpayOrder {
  execute(data: { amount: number; currency?: string }): Promise<{
    id: string;
    amount: number;
    currency: string;
  }>;
}
