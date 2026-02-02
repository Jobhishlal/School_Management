import { IGetStudentExamResultsUseCase } from "../../../domain/UseCaseInterface/Exam/StudentSeeExamMarks";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { IExamMarkRepository } from "../../../domain/repositories/Exam/IExamMarkRepoInterface";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { StudentExamResultResponse } from "../../dto/Exam/IGetStudentExamResultsUseCase";
import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";


export class GetStudentExamResultsUseCase
  implements IGetStudentExamResultsUseCase {

  constructor(
    private examRepo: IExamRepository,
    private examMarkRepo: IExamMarkRepository,
    private studentRepo: StudentDetails,
    private classRepo: IClassRepository
  ) { }

  async execute(
    studentId: string,
    classId: string
  ): Promise<StudentExamResultResponse> {

    const student = await this.studentRepo.findById(studentId);
    if (!student) throw new Error("Student not found");


    const marks = await this.examMarkRepo.findAllMarksByStudentId(studentId);
    console.log("DEBUG: Fetched Marks count:", marks.length);

    const studentDTO = {
      id: student.id,
      fullName: student.fullName,
      studentId: student.studentId,
      classId: student.classId,

      classDetails: student.classDetails
        ? {
          className: student.classDetails.className,
          division: student.classDetails.division,
          department: student.classDetails.department,
          rollNumber: student.classDetails.rollNumber,
        }
        : undefined,
    };

    const classExams = await this.examRepo.findPublishedExamsByClass(classId);
    console.log("DEBUG: Current Class Exams count:", classExams.length);

    const historyExamIds = marks.map(m => m.examId.toString());
    console.log("DEBUG: History Exam IDs:", historyExamIds);
    const historyExams = await this.examRepo.findExamsByIds(historyExamIds);
    console.log("DEBUG: Fetched History Exams count:", historyExams.length);

    const allExamsMap = new Map();
    [...classExams, ...historyExams].forEach(exam => {
      allExamsMap.set(exam.id, exam);
    });

    const exams = Array.from(allExamsMap.values());
    console.log("DEBUG: Combined unique exams count:", exams.length);

    if (!exams.length) {
      return {
        student: studentDTO,
        results: [],
      };
    }

    // specific change: fetch class details
    const classIds = [...new Set(exams.map(e => e.classId.toString()))];
    console.log("DEBUG: Extracted Class IDs:", classIds);
    const classes = await this.classRepo.findClassesByIds(classIds);
    console.log("DEBUG: Fetched Classes:", classes);
    // Fixed: Use c._id.toString() or c.id depending on entity structure, usually _id is reliable from repo
    const classMap = new Map(classes.map(c => [c._id.toString(), c]));

    console.log("DEBUG: Final Exam List:", exams);

    const results = exams.map(exam => {
      const mark = marks.find(m => m.examId.toString() === exam.id);
      const examClass = classMap.get(exam.classId.toString());

      let percentage: number | null = null;
      let status: "Pending" | "Passed" | "Failed" = "Pending";

      if (mark) {
        percentage = Math.round(
          (mark.marksObtained / exam.maxMarks) * 100
        );

        status = mark.marksObtained >= (exam.passMarks ?? 40) ? "Passed" : "Failed";
      }


      return {
        examId: exam.id,
        examTitle: exam.title,
        subject: exam.subject,
        examDate: exam.examDate,
        maxMarks: exam.maxMarks,
        passMarks: exam.passMarks ?? 40,
        marksObtained: mark?.marksObtained ?? null,
        percentage,
        progress: mark?.progress ?? null,
        remarks: mark?.remarks ?? null,
        _id: mark?.id,
        concern: mark?.concern ?? null,
        concernStatus: mark?.concernStatus ?? null,
        concernResponse: (mark as any)?.concernResponse ?? null,
        updatedAt: mark?.updatedAt ?? null,
        status,
        className: examClass?.className,
        division: examClass?.division
      };
    });

    console.log("DEBUG: Final Results Count:", results.length);

    return {
      student: studentDTO,
      results,
    };
  }


}

