import { IExamMarkRepository } from "../../../domain/repositories/Exam/IExamMarkRepoInterface";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { IGetStudentPerformanceUseCase } from "../../../domain/UseCaseInterface/Teacher/IGetStudentPerformanceUseCase";

import { StudentPerformanceDTO } from "../../dto/StudentPerformanceDTO";

export class GetStudentPerformanceUseCase implements IGetStudentPerformanceUseCase {
    constructor(
        private _examMarkRepo: IExamMarkRepository,
        private _examRepo: IExamRepository,
        private _attendanceRepo: IAttandanceRepository
    ) { }

    async execute(studentId: string): Promise<StudentPerformanceDTO> {

        let attendancePercentage = 0;
        try {
            const attendanceDashboard = await this._attendanceRepo.getStudentOwnAttendanceDashboard(studentId);
            if (attendanceDashboard) {
                attendancePercentage = attendanceDashboard.summary.percentage;
            }
        } catch (error) {
            console.error("Error fetching attendance stats", error);
        }

        const examMarks = await this._examMarkRepo.findAllMarksByStudentId(studentId);

        const examPerformance: any[] = [];
        let totalMarks = 0;
        let totalMaxMarks = 0;

        for (const mark of examMarks) {
            try {
                const exam = await this._examRepo.findById(mark.examId.toString());
                if (exam) {
                    examPerformance.push({
                        examName: exam.title,
                        subject: exam.subject,
                        marksObtained: mark.marksObtained,
                        maxMarks: exam.maxMarks,
                        grade: this.calculateGrade(mark.marksObtained, exam.maxMarks)
                    });
                    totalMarks += mark.marksObtained;
                    totalMaxMarks += exam.maxMarks;
                }
            } catch (err) {
                console.error(`Could not find exam for mark ${mark.id}`, err);
            }
        }

       
        const overallPercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
        const overallGrade = this.calculateGrade(overallPercentage, 100);

        return {
            attendancePercentage: Math.round(attendancePercentage),
            examPerformance,
            overallGrade
        };
    }

    private calculateGrade(obtained: number, max: number): string {
        const percentage = (obtained / max) * 100;
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C+';
        if (percentage >= 40) return 'C';
        return 'D';
    }
}
