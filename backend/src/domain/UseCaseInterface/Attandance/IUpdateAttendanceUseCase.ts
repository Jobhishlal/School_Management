export interface IUpdateAttendanceUseCase {
    execute(studentId: string, date: Date, session: string, status: string): Promise<boolean>;
}
