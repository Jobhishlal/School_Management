import { TeacherTimetableInfo } from "../../RepositoryInterface/Assignment/IAssignmentRepository "

export interface IGetAssignmentTeacher {
    execute(teacherId: string): Promise<{ timetable: TeacherTimetableInfo[], leaveBalance: { sickLeave: number, casualLeave: number }, teacherProfile: { name: string, image?: string } }>;
}