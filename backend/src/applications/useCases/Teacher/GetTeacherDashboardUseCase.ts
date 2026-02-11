
import { TeacherDashboardDTO } from "../../dto/TeacherDashboardDTO";
import { StudentDetails } from "../../interface/RepositoryInterface/Admin/IStudnetRepository";
import { IAssignmentRepository } from "../../interface/RepositoryInterface/Assignment/IAssignmentRepository ";
import { ITimeTableRepository } from "../../interface/RepositoryInterface/Admin/ITimeTableCreate";
import { IExamRepository } from "../../interface/RepositoryInterface/Exam/IExamRepoInterface";
import { IExamMarkRepository } from "../../interface/RepositoryInterface/Exam/IExamMarkRepoInterface";
import { IClassRepository } from "../../interface/RepositoryInterface/Classrepo/IClassRepository";
import { IGetTeacherDashboardUseCase } from "../../interface/UseCaseInterface/Teacher/IGetTeacherDashboardUseCase";

export class GetTeacherDashboardUseCase implements IGetTeacherDashboardUseCase {
    constructor(
        private studentRepo: StudentDetails,
        private assignmentRepo: IAssignmentRepository,
        private timetableRepo: ITimeTableRepository,
        private examRepo: IExamRepository,
        private examMarkRepo: IExamMarkRepository,
        private classRepo: IClassRepository
    ) { }

    async execute(teacherId: string): Promise<TeacherDashboardDTO> {

        const teacherClass = await this.classRepo.findByTeacherId(teacherId);

        let totalClassStudents = 0;
        let topStudents: any[] = [];

        if (teacherClass) {

            totalClassStudents = await this.studentRepo.countByClassId(teacherClass._id);

            topStudents = await this.examMarkRepo.getTopPerformingStudents(teacherClass._id, 3);
        }

        const totalSchoolStudents = await this.studentRepo.countAll();

        const activeAssignmentCount = await this.assignmentRepo.countActiveAssignments(teacherId);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];
        const todaysSchedule = await this.timetableRepo.getTeacherDailySchedule(teacherId, today);


        const allExams = await this.examRepo.getExamsByTeacher(teacherId);
        const upcomingExams = allExams.filter(exam => new Date(exam.examDate) >= new Date());

        return {
            totalClassStudents,
            totalSchoolStudents,
            activeAssignmentCount,
            todaysSchedule,
            topStudents: topStudents.map(s => ({
                studentId: s.studentId,
                fullName: s.fullName,
                avgMarks: Math.round(s.avgMarks),
                className: teacherClass ? teacherClass.className + " " + teacherClass.division : "N/A",
                photoUrl: s.photo

            })),
            upcomingExams
        };
    }
}
