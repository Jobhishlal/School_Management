import { IStudentDashboardUseCase } from "../../interface/UseCaseInterface/StudentDashboard/IStudentDashboardUseCase";
import { StudentDashboardDTO } from "../../dto/StudentDashboard/StudentDashboardDTO";
import { ITimeTableRepository } from "../../interface/RepositoryInterface/Admin/ITimeTableCreate";
import { IAttandanceRepository } from "../../interface/RepositoryInterface/Attandance/IAttendanceRepository";
import { IAssignmentRepository } from "../../interface/RepositoryInterface/Assignment/IAssignmentRepository ";
import { IExamRepository } from "../../interface/RepositoryInterface/Exam/IExamRepoInterface";
import { IAnnouncementRepository } from "../../interface/RepositoryInterface/Announcement/IAnnouncement";
import { StudentDetails } from "../../interface/RepositoryInterface/Admin/IStudnetRepository";
import { DayScheduleEntity } from "../../../domain/entities/TimeTableEntity";
import { AssignmentEntity } from "../../../domain/entities/Assignment";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";

export class GetStudentDashboardUseCase implements IStudentDashboardUseCase {
    constructor(
        private timeTableRepo: ITimeTableRepository,
        private attendanceRepo: IAttandanceRepository,
        private assignmentRepo: IAssignmentRepository,
        private examRepo: IExamRepository,
        private announcementRepo: IAnnouncementRepository,
        private studentRepo: StudentDetails
    ) { }

    async execute(studentId: string): Promise<StudentDashboardDTO> {
        let classId = "";
        let division = "";

        try {
            const student = await this.studentRepo.findById(studentId);
            if (student) {


                classId = student.classId;
                if (student.classDetails) {
                    division = student.classDetails.division;
                }
            }
        } catch (error) {
            console.error("Error fetching student details:", error);
            throw new Error("Student not found");
        }

        if (!classId) {
            console.error("Student has no class assigned");

        }

        const today = new Date();
        const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

        let todayClasses: any[] = [];
        if (classId && division) {
            try {
                const timeTable = await this.timeTableRepo.getByClass(classId, division);
                if (timeTable) {
                    const daySchedule = timeTable.days.find((d: DayScheduleEntity) => d.day === dayName);
                    if (daySchedule) {
                        todayClasses = daySchedule.periods;
                    }
                }
            } catch (error) {
                console.error("Error fetching timetable:", error);
            }
        }


        let attendancePercentage = 0;
        try {
            const attendanceDashboard = await this.attendanceRepo.getStudentOwnAttendanceDashboard(studentId);
            if (attendanceDashboard && attendanceDashboard.summary) {
                attendancePercentage = attendanceDashboard.summary.percentage;
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }

        let pendingAssignments: any[] = [];
        try {
            const allAssignments = await this.assignmentRepo.getAssignmetEachStudent(studentId);
            pendingAssignments = allAssignments.filter((a: AssignmentEntity) => {
                const dueDate = new Date(a.Assignment_Due_Date);
                return dueDate >= today;
            });
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }


        let upcomingExams: any[] = [];
        if (classId) {
            try {
                const exams = await this.examRepo.findPublishedExamsByClass(classId);
                upcomingExams = exams.filter((e: ExamEntity) => {
                    const examDate = new Date(e.examDate);
                    return examDate >= today;
                });
            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        }

        // 5. Get Announcements
        let announcements: any[] = [];
        if (classId) {
            try {
                announcements = await this.announcementRepo.findForClass(classId);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        }

        return {
            todayClasses,
            attendancePercentage,
            pendingAssignments,
            upcomingExams,
            announcements
        };
    }
}
