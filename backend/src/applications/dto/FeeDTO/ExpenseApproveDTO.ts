export interface ExpenseApproveDTO {
  expenseId: string;
  action: "APPROVED" | "REJECTED";
  approvedBy: string; 
}