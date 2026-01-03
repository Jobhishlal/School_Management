export interface MonthlyExpense{
    month:string;
    totalAmount:string
    
}

export interface ExpenseReport {
    totalExpense:string;
    approvedExpense:string;
    pendingExpense: number; 
    monthlyexpense: MonthlyExpense[];  

}