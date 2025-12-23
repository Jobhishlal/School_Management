import { IGetStudentExamResultsUseCase } from "../../../domain/UseCaseInterface/Exam/StudentSeeExamMarks";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { IExamMarkRepository } from "../../../domain/repositories/Exam/IExamMarkRepoInterface";


  export class GetStudentExamResultsUseCase implements IGetStudentExamResultsUseCase{
  constructor(
    private examRepo: IExamRepository,
    private examMarkRepo: IExamMarkRepository
  ) {}

  async execute(studentId: string, classId: string) {
 
    const exams = await this.examRepo.findPublishedExamsByClass(classId);

    if (exams.length === 0) return [];

    const examIds = exams.map(e => e.id);
    const marks = await this.examMarkRepo.findMarksForStudent(
      studentId,
      examIds
    );

    
    return exams.map(exam => {
      const mark = marks.find(
        m => m.examId.toString() === exam.id
      );

      const percentage = mark
        ? Math.round((mark.marksObtained / exam.maxMarks) * 100)
        : null;

      return {
        examId: exam.id,
        examTitle: exam.title,
        subject: exam.subject,
        examDate: exam.examDate,
        maxMarks: exam.maxMarks,

        marksObtained: mark?.marksObtained ?? null,
        percentage,

        progress: mark?.progress ?? null,
        remarks: mark?.remarks ?? null,

        status:
          mark === undefined
            ? "Pending"
            : percentage! >= 40
            ? "Passed"
            : "Failed",
      };
    });
  }
}

