import { ExamEntity } from "../../../../domain/entities/Exam/ExamEntity";

export interface IStudentExamListUseCase {
  execute(studentId: string): Promise<ExamEntity[]>;
}
