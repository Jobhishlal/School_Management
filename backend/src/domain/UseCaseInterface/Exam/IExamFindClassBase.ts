import { ExamEntity } from "../../entities/Exam/ExamEntity";

export interface IExamFindByClassUseCase {
  execute(params: {
    classId: string;
    teacherId: string;
  }): Promise<ExamEntity[]>;
}