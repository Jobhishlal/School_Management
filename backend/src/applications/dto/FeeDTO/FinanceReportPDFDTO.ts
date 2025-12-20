export interface FinanceReportPDFData {
  instituteName: string;
  instituteEmail: string;
  institutePhone: string;
  instituteAddress: string;
  instituteLogo?: string;

  startDate: string;
  endDate: string;

  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;

  totalExpense: number;
  approvedExpense: number;
  pendingExpense: number;

  monthlyRevenue: { month: string; totalAmount: number }[];
  monthlyExpense: { month: string; totalAmount: number }[];
}
