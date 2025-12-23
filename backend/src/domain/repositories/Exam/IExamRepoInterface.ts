import { CreateExamDTO } from "../../../applications/dto/Exam/CreateExamDTO";
import { ExamEntity } from "../../entities/Exam/ExamEntity";
import { Types } from "mongoose";
import { UpdateExamDTO } from "../../../applications/dto/Exam/UpdateExamDTO";

export interface IExamRepository {
  createExam(data: CreateExamDTO): Promise<ExamEntity>;
  updateexam(id: string, data: UpdateExamDTO): Promise<ExamEntity | null>;
  getExamsByTeacher(teacherId: string): Promise<ExamEntity[]>;


}