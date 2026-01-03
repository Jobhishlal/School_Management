export interface MonthlyRevenue{
    month:string;
    totalAmount:string
    
}

export interface RevanueReport {
    totalRevenue:string;
    PaidRevenue:string;
    pendingRevenue: number;
    
    monthlyRevenue: MonthlyRevenue[];  

}