import { IGetStudentExamResultsUseCase } from "../../../domain/UseCaseInterface/Exam/StudentSeeExamMarks";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { IExamMarkRepository } from "../../../domain/repositories/Exam/IExamMarkRepoInterface";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { StudentExamResultResponse } from "../../dto/Exam/IGetStudentExamResultsUseCase";


export class GetStudentExamResultsUseCase
  implements IGetStudentExamResultsUseCase {

  constructor(
    private examRepo: IExamRepository,
    private examMarkRepo: IExamMarkRepository,
    private studentRepo: StudentDetails
  ) { }

  async execute(
    studentId: string,
    classId: string
  ): Promise<StudentExamResultResponse> {

    const student = await this.studentRepo.findById(studentId);
    if (!student) throw new Error("Student not found");

    const exams = await this.examRepo.findPublishedExamsByClass(classId);


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

    if (!exams.length) {
      return {
        student: studentDTO,
        results: [],
      };
    }

    const examIds = exams.map(e => e.id);
    const marks = await this.examMarkRepo.findMarksForStudent(
      studentId,
      examIds
    );
    console.log("exam result", marks)

    const results = exams.map(exam => {
      const mark = marks.find(m => m.examId.toString() === exam.id);

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
      };
    });

    return {
      student: studentDTO,
      results,
    };
  }


}

