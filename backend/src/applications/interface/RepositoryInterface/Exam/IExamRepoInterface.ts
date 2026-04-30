import { ExamEntity } from "../../../../domain/entities/Exam/ExamEntity";

export interface IExamRepository {
  createExam(exam: ExamEntity): Promise<ExamEntity>;
  updateexam(id: string, data: Partial<ExamEntity>): Promise<ExamEntity | null>;
  getExamsByTeacher(teacherId: string): Promise<ExamEntity[]>;
  getExamsByTeacherWithStudents(classId: string): Promise<ReturnType<typeof JSON.parse>[]>;
  findById(examId: string): Promise<ExamEntity | null>;
  findByClassAndTeacher(classId: string, teacherId: string): Promise<ExamEntity[]>;
  findPublishedExamsByClass(classId: string): Promise<ExamEntity[]>;
  findExamsByIds(examIds: string[]): Promise<ExamEntity[]>;
}