import { Students } from "../entities/Students";

export interface IStudentUpdateUseCase {
  execute(id: string, update: Partial<Students>): Promise<Students | null>;
}