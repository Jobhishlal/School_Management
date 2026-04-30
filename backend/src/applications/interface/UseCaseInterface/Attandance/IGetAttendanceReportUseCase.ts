
export interface IGetAttendanceReportUseCase {
    execute(classId: string, startDate: Date, endDate: Date): Promise<ReturnType<typeof JSON.parse>>;
}
