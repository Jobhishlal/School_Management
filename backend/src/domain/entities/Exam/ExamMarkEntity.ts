import { Types } from "mongoose";

export type StudentProgress =
  | "EXCELLENT"
  | "GOOD"
  | "NEEDS_IMPROVEMENT"
  | "POOR";

export class ExamMarkEntity {
  constructor(
    public readonly id: string,
    public readonly examId: Types.ObjectId,
    public readonly studentId: Types.ObjectId,
    public readonly teacherId: Types.ObjectId,
    public readonly marksObtained: number,

    public readonly progress: StudentProgress,
    public readonly remarks: string,
    public readonly concern: string | null,
    public readonly concernStatus: "Pending" | "Resolved" | "Rejected" | null,
    public readonly concernResponse: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) { }
}
