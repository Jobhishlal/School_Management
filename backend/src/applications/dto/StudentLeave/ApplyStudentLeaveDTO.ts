export interface ApplyStudentLeaveDTO {
    studentId: string;
    classId: string;
    parentId: string;
    leaveType: string;
    startDate: string | Date;
    endDate: string | Date;
    reason: string;
}
