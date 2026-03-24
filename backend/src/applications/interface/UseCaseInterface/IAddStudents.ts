import { Students } from "../../../domain/entities/Students";
import { CreateStudentDTO } from "../../dto/StudentDTO";

export interface IStudentAddUsecase {
  execute(dto: CreateStudentDTO): Promise<{ student: Students; tempPassword: string }>;
}
