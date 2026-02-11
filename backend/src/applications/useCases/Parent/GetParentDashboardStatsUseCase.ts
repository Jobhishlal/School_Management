import { IAttandanceRepository } from "../../interface/RepositoryInterface/Attandance/IAttendanceRepository";
import { IExamMarkRepository } from "../../interface/RepositoryInterface/Exam/IExamMarkRepoInterface";
import { StudentDetails } from "../../interface/RepositoryInterface/Admin/IStudnetRepository";
import { ParentDashboardStatsDTO } from "../../dto/Parent/ParentDashboardStatsDTO";
import { IParentRepositorySign } from "../../interface/RepositoryInterface/Auth/IParentRepository";

export class GetParentDashboardStatsUseCase {
    constructor(
        private studentRepo: StudentDetails,
        private attendanceRepo: IAttandanceRepository,
        private examRepo: IExamMarkRepository,
        private parentRepo: IParentRepositorySign
    ) { }

    async execute(parentId: string): Promise<ParentDashboardStatsDTO> {

        // 1. Get Student ID for the Parent
        const parentRelation = await this.attendanceRepo.findParentWithStudent(parentId);

        if (!parentRelation || !parentRelation.studentId) {
            throw new Error("Student not found for this parent");
        }

        const studentId = parentRelation.studentId;

        // 2. Fetch Student Profile
        const student = await this.studentRepo.findById(studentId);
        if (!student) {
            throw new Error("Student details not found");
        }

        // Calculate Age from DOB
        const age = student.dateOfBirth ? new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear() : 0;

        // 3. Fetch Attendance Stats
        const attendanceDashboard = await this.attendanceRepo.getParentAttendanceDashboard(parentId);

        const attendanceStats = {
            totalClasses: attendanceDashboard.summary.totalClasses,
            present: attendanceDashboard.summary.present,
            absent: attendanceDashboard.summary.absent,
            leave: attendanceDashboard.summary.leave,
            percentage: attendanceDashboard.summary.percentage
        };

        // 4. Fetch Exam Stats
        const allMarks = await this.examRepo.findAllMarksByStudentId(studentId);

        // Process Marks Trend (Average per Exam)
        const marksTrendMap = new Map<string, { total: number; count: number }>();
        allMarks.forEach(mark => {
            const examData = mark.examId as any;
            // Use exam title or type + date for the label. 
            // If populated, examData has 'title', 'subject', 'type' etc.
            const examLabel = examData.title || `Exam`;

            if (!marksTrendMap.has(examLabel)) {
                marksTrendMap.set(examLabel, { total: 0, count: 0 });
            }
            const current = marksTrendMap.get(examLabel)!;
            current.total += mark.marksObtained;
            current.count += 1;
        });

        // Subject Comparison
        const subjectMap = new Map<string, { total: number; count: number }>();
        allMarks.forEach(mark => {
            const examData = mark.examId as any;
            // Use populated subject if available
            const subject = examData.subject || "General";

            if (!subjectMap.has(subject)) {
                subjectMap.set(subject, { total: 0, count: 0 });
            }
            const current = subjectMap.get(subject)!;
            current.total += mark.marksObtained;
            current.count += 1;
        });

        const subjectComparison = Array.from(subjectMap.entries()).map(([name, data]) => ({
            name,
            value: Math.round(data.total / data.count)
        })).slice(0, 5);


        const PASS_MARK = 35;
        let passed = 0;
        let failed = 0;
        allMarks.forEach(mark => {
            if (mark.marksObtained >= PASS_MARK) passed++;
            else failed++;
        });


        const examsMap = new Map<string, { total: number; count: number; name: string }>();

        allMarks.forEach(mark => {
            const examData = mark.examId as any;
            const examIdStr = examData._id ? examData._id.toString() : mark.examId.toString();
            const examName = examData.title || `Exam`;

            if (!examsMap.has(examIdStr)) {
                examsMap.set(examIdStr, { total: 0, count: 0, name: examName });
            }
            const current = examsMap.get(examIdStr)!;
            current.total += mark.marksObtained;
            current.count += 1;
        });

        const trendData = Array.from(examsMap.values()).map(e => ({
            name: e.name,
            value: Math.round(e.total / e.count)
        }));

        const passFailRatio = [
            { name: 'Passed', value: passed, color: '#3B82F6' },
            { name: 'Failed', value: failed, color: '#EF4444' }
        ];

        return {
            studentProfile: {
                name: student.fullName,
                rollNo: student.studentId,
                className: student.classDetails?.className || "N/A",
                section: student.classDetails?.division || "A",
                age: age,
                bloodGroup: "N/A",
                photo: student.photos?.[0]?.url || ""
            },
            attendance: attendanceStats,
            examStats: {
                marksTrend: trendData.length > 0 ? trendData : [{ name: 'No Data', value: 0 }],
                subjectComparison,
                passFailRatio
            }
        };
    }
}
