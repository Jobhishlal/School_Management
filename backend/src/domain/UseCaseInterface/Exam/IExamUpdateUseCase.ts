import { Types } from "mongoose";
import { ExamEntity } from "../../entities/Exam/ExamEntity";
import { UpdateExamDTO } from "../../../applications/dto/Exam/UpdateExamDTO";

export interface IExamUpdateTeacherUseCase {
  execute(id: string,data:UpdateExamDTO): Promise<ExamEntity>;
}
