import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { IExamMarkRepository } from "../../../domain/repositories/Exam/IExamMarkRepoInterface";

export class GetStudentsByExamUseCase {
  constructor(
    private examRepo: IExamRepository,
    private studentRepo: StudentDetails,
    private examMarkRepo: IExamMarkRepository
  ) { }

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


    console.log(`ExamID: ${examId}, Students Found: ${students.length}, Marks Found: ${examMarks.length}`);
    console.log("First Mark Sample:", examMarks[0]);

    const results = students.map((student) => {

      const mark = examMarks.find(
        (m) => {
          const markStuId = m.studentId.toString();
          const stuId = student.id.toString();
          return markStuId === stuId;
        }
      );

      console.log(`Student: ${student.fullName} (${student.id}), Found Mark: ${!!mark ? mark.marksObtained : 'No'}`);

      return {
        _id: student.id,
        studentId: student.studentId || "N/A",
        fullName: student.fullName,
        examName: exam.title,
        marksObtained: mark?.marksObtained ?? 0,
        progress: mark?.progress ?? "Pending",
        remarks: mark?.remarks ?? "-",
        isMarked: !!mark,
        concern: (mark as any)?.concern ?? null,
        concernStatus: (mark as any)?.concernStatus ?? null,
        concernResponse: (mark as any)?.concernResponse ?? null,
        examMarkId: (mark as any)?._id ?? null
      };
    });

    return results;
  }
}
