
export interface IGetStudentAttendanceHistoryUseCase {
    execute(studentId: string, month: number, year: number): Promise<ReturnType<typeof JSON.parse>>;
}
