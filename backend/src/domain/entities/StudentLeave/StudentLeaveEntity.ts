export class StudentLeaveEntity {
    constructor(
        public readonly id: string,
        public readonly studentId: string | any,
        public readonly classId: string,
        public readonly parentId: string,
        public readonly leaveType: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly reason: string,
        public readonly status: "PENDING" | "APPROVED" | "REJECTED",
        public readonly appliedAt: Date,
        public readonly actionBy?: string,
        public readonly actionAt?: Date,
        public readonly responseMessage?: string,
    ) { }
}
