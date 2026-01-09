export interface CreateLeaveDTO{
    
   leaveType: "CASUAL" | "SICK" | "PAID" | "UNPAID";
   startDate: Date;
   endDate: Date;
   reason: string;

}