import { Students } from "../../entities/Students";


export interface IGetStudentsByClassUseCase {
  execute(classId: string, teacherId?: string): Promise<Students[]>;
}
