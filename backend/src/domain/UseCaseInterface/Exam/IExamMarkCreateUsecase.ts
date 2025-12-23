import { CreateExamMarkDTO } from "../../../applications/dto/Exam/CreateExamMarkDTO";
import { ExamMarkEntity } from "../../entities/Exam/ExamMarkEntity";

export interface ICreateExamMarkUseCase {
  execute(
    teacherId: string,
    data: CreateExamMarkDTO
  ): Promise<ExamMarkEntity>;
}
