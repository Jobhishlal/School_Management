import { CreateExamDTO } from "../../../applications/dto/Exam/CreateExamDTO";
import { ExamEntity } from "../../entities/Exam/ExamEntity";
import { Types } from "mongoose";
import { UpdateExamDTO } from "../../../applications/dto/Exam/UpdateExamDTO";

export interface IExamRepository {
  createExam(data: CreateExamDTO): Promise<ExamEntity>;
  updateexam(id: string, data: UpdateExamDTO): Promise<ExamEntity | null>;
  getExamsByTeacher(teacherId: string): Promise<ExamEntity[]>;
  getExamsByTeacherWithStudents(classId: string): Promise<any[]>;
  findById(examId: string): Promise<ExamEntity | null>;
  findByClassAndTeacher(classId: string, teacherId: string): Promise<ExamEntity[]>;
  findPublishedExamsByClass(classId: string): Promise<ExamEntity[]>
  findExamsByIds(examIds: string[]): Promise<ExamEntity[]>;

}