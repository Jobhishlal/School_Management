import { ExamMarkEntity } from "../../entities/Exam/ExamMarkEntity";

export interface IExamMarkRepository {
  create(mark: ExamMarkEntity): Promise<ExamMarkEntity>;
  update(id: string, data: Partial<ExamMarkEntity>): Promise<ExamMarkEntity | null>;
  findByExamAndStudent(examId: string, studentId: string): Promise<ExamMarkEntity | null>;
  updateMark(id: string, updates: Partial<ExamMarkEntity>): Promise<ExamMarkEntity | null>;
  findClassResults(classId: string, teacherId: string, examId: string): Promise<any[]>;
  findMarksForStudent(studentId: string, examIds: string[]): Promise<ExamMarkEntity[]>;
  updateConcern(id: string, concern: string): Promise<boolean>;
  resolveConcern(id: string, status: "Resolved" | "Rejected", newMarks?: number, responseMessage?: string): Promise<boolean>;
  findAllMarksByStudentId(studentId: string): Promise<ExamMarkEntity[]>;
  getPendingConcernsInfoByExamIds(examIds: string[]): Promise<Record<string, Array<{ studentName: string, concern: string, studentId: string }>>>;
  calculateClassAverage(classId: string): Promise<{ average: number, trend: number }>;
  calculateSchoolAverage(): Promise<number>;
  getClassPerformanceHistory(classId: string): Promise<Array<{ month: string, avg: number }>>;
  getTopPerformingStudents(classId: string, limit: number): Promise<any[]>;
  getLowPerformingStudents(classId: string, limit: number): Promise<any[]>;
}