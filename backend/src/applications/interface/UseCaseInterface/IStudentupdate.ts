import { Students } from "../../../domain/entities/Students";
import { UpdateStudentDTO } from "../../dto/StudentDTO";

export interface IStudentUpdateUseCase {
  execute(dto: UpdateStudentDTO): Promise<Students | null>;
}