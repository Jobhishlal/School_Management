import { Class } from "../../entities/Class";
export interface IClassRepository {
  getAll(): Promise<Class[]>;
  create(data: Class): Promise<Class>;
  updateClass(id: string, update: Partial<Class>): Promise<Class | null>;
  assignClassWithDivision(className: string): Promise<Class | null>
  findById(id: string): Promise<Class>
  assignStudentToClass(studentId: string, classId: string): Promise<boolean>;
  assignManyStudentsToClass(studentIds: string[], classId: string): Promise<boolean>;
  deleteClass(id: string): Promise<boolean>;
  findByTeacherId(teacherId: string): Promise<Class | null>
}
