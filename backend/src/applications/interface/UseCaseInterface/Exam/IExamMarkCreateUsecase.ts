import { CreateExamMarkDTO } from "../../../dto/Exam/CreateExamMarkDTO";
import { ExamMarkEntity } from "../../../../domain/entities/Exam/ExamMarkEntity";

export interface ICreateExamMarkUseCase {
  execute(
    teacherId: string,
    data: CreateExamMarkDTO
  ): Promise<ExamMarkEntity>;
}
