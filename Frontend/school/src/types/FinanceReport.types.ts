export interface MonthlyRevenue {
  month: string;
  totalAmount: number;
}

export interface RevenueReport {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  monthlyRevenue: MonthlyRevenue[];
}
