export interface IStudentFullFeePaymentStatusUseCase {
  execute(classId: string, page: number, limit: number): Promise<{ students: ReturnType<typeof JSON.parse>[], total: number }>;
}
