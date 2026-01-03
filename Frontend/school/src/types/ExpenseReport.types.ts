export interface MonthlyExpense {
  month: string;      
  totalAmount: number;  
}

export interface ExpenseReportType {
  totalExpense: number;   
  approvedExpense: number;  
  pendingExpense: number;    
  monthlyExpense: MonthlyExpense[];
}
