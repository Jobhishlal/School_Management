export interface IStudentFullFeePaymentStatusUseCase {
  execute(classId: string): Promise<any[]>;
}
