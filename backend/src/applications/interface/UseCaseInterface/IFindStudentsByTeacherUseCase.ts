import { Students } from "../../../domain/entities/Students";

export interface IFindStudentsByTeacherUseCase {

  execute(teacherId: string): Promise<Students[]>;
}
