export interface IParentDateBaseAttendance {
    execute(parentId: string, startDate: Date, endDate: Date): Promise<ReturnType<typeof JSON.parse>>
}