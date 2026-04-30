
export interface IStudentPaymentHistorySeeAdmin {
    
    execute(studentName?: string): Promise<ReturnType<typeof JSON.parse>[]>;
}
