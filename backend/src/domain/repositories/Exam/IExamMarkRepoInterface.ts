import { ExamMarkResponseDTO } from "../../../applications/dto/Exam/ExamMarkCreateDTO";
import { ExamMarkEntity } from "../../entities/Exam/ExamMarkEntity";
import { CreateExamMarkDTO } from "../../../applications/dto/Exam/CreateExamMarkDTO";
import { UpdateExamMarkDTO } from "../../../applications/dto/Exam/UpdateExamMarkDTO";
export interface IExamMarkRepository {
  create(data: CreateExamMarkDTO): Promise<ExamMarkEntity>
  update(id: string, data: UpdateExamMarkDTO): Promise<ExamMarkEntity | null>;
  findByExamAndStudent(examId: string, studentId: string): Promise<ExamMarkEntity | null>;
  updateMark(id: string, updates: Partial<ExamMarkEntity>): Promise<ExamMarkEntity | null>;
  findClassResults(classId: string, teacherId: string, examId: string): Promise<ExamMarkEntity[]>
  findMarksForStudent(studentId: string, examIds: string[]): Promise<ExamMarkEntity[]>;
  updateConcern(id: string, concern: string): Promise<boolean>;
  resolveConcern(id: string, status: "Resolved" | "Rejected", newMarks?: number, responseMessage?: string): Promise<boolean>;
  getPendingConcernsInfoByExamIds(examIds: string[]): Promise<Record<string, Array<{ studentName: string, concern: string, studentId: string }>>>;
}