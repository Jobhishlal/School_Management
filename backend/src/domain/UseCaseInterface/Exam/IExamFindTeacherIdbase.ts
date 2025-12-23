import { ExamEntity } from "../../entities/Exam/ExamEntity";

export interface IGetTeacherExamsUseCase {
  execute(teacherId: string): Promise<ExamEntity[]>;
}