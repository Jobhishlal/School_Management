
export interface IStudentPaymentHistorySeeAdmin {
    
    execute(studentName?: string): Promise<any[]>;
}
