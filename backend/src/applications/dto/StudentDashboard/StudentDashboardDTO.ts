import { PeriodEntity } from "../../../domain/entities/TimeTableEntity";
import { AssignmentEntity } from "../../../domain/entities/Assignment";
import { Announcement } from "../../../domain/entities/Announcement/Announcement";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";

export interface StudentDashboardDTO {
    todayClasses: PeriodEntity[];
    attendancePercentage: number;
    pendingAssignments: AssignmentEntity[];
    upcomingExams: ExamEntity[];
    announcements: Announcement[];
}
