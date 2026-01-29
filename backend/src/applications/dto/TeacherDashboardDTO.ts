
import { TeacherDailyScheduleDTO } from "./TeacherDailyScheduleDTO";
import { ExamEntity } from "../../domain/entities/Exam/ExamEntity";

export interface StudentPerformanceDTO {
    studentId: string;
    fullName: string;
    avgMarks: number;
    photoUrl?: string;
    className: string;
}

export interface TeacherDashboardDTO {
    totalClassStudents: number;
    totalSchoolStudents: number;
    activeAssignmentCount: number;
    todaysSchedule: TeacherDailyScheduleDTO[];
    topStudents: StudentPerformanceDTO[];
    upcomingExams: ExamEntity[];
}
