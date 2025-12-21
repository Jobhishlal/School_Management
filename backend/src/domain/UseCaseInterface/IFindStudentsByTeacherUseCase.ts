import { Students } from "../entities/Students";

export interface IFindStudentsByTeacherUseCase {

  execute(teacherId: string): Promise<Students[]>;
}
