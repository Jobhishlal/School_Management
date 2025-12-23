import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { IExamMarkRepository } from "../../../domain/repositories/Exam/IExamMarkRepoInterface";

export class GetStudentsByExamUseCase {
  constructor(
    private examRepo: IExamRepository,
    private studentRepo: StudentDetails,
    private examMarkRepo: IExamMarkRepository
  ) {}

  async execute(teacherId: string, examId: string) {

    const exam = await this.examRepo.findById(examId);
    if (!exam) throw new Error("Exam not found");
    if (exam.teacherId.toString() !== teacherId)
      throw new Error("You are not allowed to access this exam");

    const students = await this.studentRepo.findByClassId(exam.classId.toString());

    const examMarks = await this.examMarkRepo.findClassResults(
      exam.classId.toString(),
      teacherId,
      exam.id 
    );

   
    const results = students.map((student) => {
       
      const mark = examMarks.find(
        (m) => m.studentId.toString() === student.id.toString()
      );

      return {
        studentId: student.id,
        fullName: student.fullName,
        rollNo: student.studentId || "N/A",
        examName: exam.title,
        marksObtained: mark?.marksObtained ?? 0,
        progress: mark?.progress ?? "Pending",
        remarks: mark?.remarks ?? "-",
      };
    });

    return results;
  }
}
