import { ExamEntity } from "../../../../domain/entities/Exam/ExamEntity";

export interface IGetTeacherExamsUseCase {
  execute(teacherId: string): Promise<ExamEntity[]>;
}