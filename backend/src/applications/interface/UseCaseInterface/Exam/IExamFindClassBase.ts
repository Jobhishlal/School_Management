import { ExamEntity } from "../../../../domain/entities/Exam/ExamEntity";

export interface IExamFindByClassUseCase {
  execute(params: {
    classId: string;
    teacherId: string;
  }): Promise<ExamEntity[]>;
}