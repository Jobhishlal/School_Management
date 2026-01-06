export interface IStudentFullFeePaymentStatusUseCase {
  execute(classId: string, page: number, limit: number): Promise<{ students: any[], total: number }>;
}
