import { Types } from "mongoose";
import { ExamEntity } from "../../../../domain/entities/Exam/ExamEntity";
import { UpdateExamDTO } from "../../../dto/Exam/UpdateExamDTO";

export interface IExamUpdateTeacherUseCase {
  execute(id: string,data:UpdateExamDTO): Promise<ExamEntity>;
}
