import { Class } from "../../entities/Class";
import { Students } from "../../entities/Students";

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
    }
}

export interface IGetTeacherClassDetailsUseCase {
    execute(teacherId: string, search?: string, page?: number, limit?: number): Promise<ClassDetailsDTO | null>;
}
