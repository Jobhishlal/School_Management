import { Class } from "../../domain/entities/Class";
import { Students } from "../../domain/entities/Students";
export interface ClassDetailsDTO {
    classInfo: Class;
    students: (Students & { attendancePercentage: number })[];
    totalStudents: number;
    teacherName: string;
    totalCount: number;
    stats: {
        attendance: { percentage: number, trend: number };
        performance: { average: number, trend: number };
        schoolAverage: number;
        history: Array<{ month: string, avg: number }>;
        topStudents: Array<{ _id: string, fullName: string, studentId: string, avgMarks: number }>;
        weakStudents: Array<{ _id: string, fullName: string, studentId: string, avgMarks: number }>;
    }
}
