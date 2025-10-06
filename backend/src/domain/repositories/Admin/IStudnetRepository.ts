import { Students } from "../../entities/Students";

export interface StudentDetails {
  create(student: Students): Promise<Students>;
  findById(id: string): Promise<Students | null>;
  getAllStudents(): Promise<Students[]>;
  updateBlockStatus(id: string, blocked: boolean): Promise<Students>;
  updateAll(id:string,update:Partial<Students>):Promise<Students|null>
  findStudentid(studentId:string):Promise<Students | null>
}
