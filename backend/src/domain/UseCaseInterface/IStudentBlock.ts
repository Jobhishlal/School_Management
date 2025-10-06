import { Students } from "../entities/Students";

export interface IStudentBlock {
  execute(id: string, blocked: boolean): Promise<Students>;
}
