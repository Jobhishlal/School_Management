import { Students } from "../../../../domain/entities/Students";

export interface StudentDetails {
  create(student: Students): Promise<Students>;
  findById(id: string): Promise<Students | null>;
  getAllStudents(): Promise<Students[]>;
  updateBlockStatus(id: string, blocked: boolean): Promise<Students>;
  updateAll(id: string, update: Partial<Students>): Promise<Students | null>
  findStudentid(studentId: string): Promise<Students | null>
  findStudentById(id: string): Promise<Students | null>
  findByClassId(classId: string): Promise<Students[]>;
  findByStudentClassIdBase(classId: string): Promise<Students[]>
  findByClassIdWithSearch(classId: string, search: string, page: number, limit: number): Promise<{ students: Students[], total: number }>;
  search(query: string): Promise<Students[]>;
  countAll(): Promise<number>; // New
  countByClassId(classId: string): Promise<number>;
  countBlocked(): Promise<number>; // New
}
