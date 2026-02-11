import { IClassRepository } from "../../interface/RepositoryInterface/Classrepo/IClassRepository";
import { StudentDetails } from "../../interface/RepositoryInterface/Admin/IStudnetRepository";

import { IGetTeacherClassDetailsUseCase } from "../../interface/UseCaseInterface/Teacher/IGetTeacherClassDetailsUseCase";
import { ITeacherCreate } from "../../interface/RepositoryInterface/TeacherCreate";

import { IExamMarkRepository } from "../../interface/RepositoryInterface/Exam/IExamMarkRepoInterface";
import { IAttandanceRepository } from "../../interface/RepositoryInterface/Attandance/IAttendanceRepository";
import { ClassDetailsDTO } from "../../dto/ClassDetailsDTO";

export class GetTeacherClassDetailsUseCase implements IGetTeacherClassDetailsUseCase {
    constructor(
        private _classRepo: IClassRepository,
        private _studentRepo: StudentDetails,
        private _teacherRepo: ITeacherCreate,
        private _examMarkRepo: IExamMarkRepository,
        private _attendanceRepo: IAttandanceRepository
    ) { }

    async execute(teacherId: string, search: string = "", page: number = 1, limit: number = 10): Promise<ClassDetailsDTO | null> {

        const classInfo = await this._classRepo.findByTeacherId(teacherId);

        if (!classInfo) {
            return null;
        }

        const [
            studentData,
            teacher,
            attendanceStats,
            classAvg,
            schoolAvg,
            history,
            topStudents,
            weakStudents
        ] = await Promise.all([
            this._studentRepo.findByClassIdWithSearch(classInfo._id, search, page, limit),
            this._teacherRepo.findById(teacherId),
            this._attendanceRepo.calculateClassAttendancePercentage(classInfo._id),
            this._examMarkRepo.calculateClassAverage(classInfo._id),
            this._examMarkRepo.calculateSchoolAverage(),
            this._examMarkRepo.getClassPerformanceHistory(classInfo._id),
            this._examMarkRepo.getTopPerformingStudents(classInfo._id, 2),
            this._examMarkRepo.getLowPerformingStudents(classInfo._id, 2)
        ]);

        const teacherName = teacher ? teacher.name : "Unknown Teacher";


        const studentIds = studentData.students.map(s => s.id?.toString() || "");
        const studentPercentages = await this._attendanceRepo.getAttendancePercentages(studentIds);

        const studentsWithStats = studentData.students.map(student => {
            const id = student.id?.toString() || "";
            return {
                ...student,
                attendancePercentage: studentPercentages[id] || 0
            };
        });

        return {
            classInfo,
            students: studentsWithStats,
            totalStudents: studentData.total,
            totalCount: studentData.total,
            teacherName,
            stats: {
                attendance: attendanceStats,
                performance: classAvg,
                schoolAverage: schoolAvg,
                history,
                topStudents,
                weakStudents
            }
        };
    }
}
