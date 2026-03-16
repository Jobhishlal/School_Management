import { Students } from "../../../domain/entities/Students";
export interface IStudentAddUsecase {
  execute(student: Students): Promise<{ student: Students; tempPassword: string }>;
}
