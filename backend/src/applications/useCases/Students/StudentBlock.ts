import { IStudentBlock } from "../../../domain/UseCaseInterface/IStudentBlock";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { Students } from "../../../domain/entities/Students";

export class StudentBlock implements IStudentBlock {
  constructor(private studentRepo: StudentDetails) {}

  async execute(id: string, blocked: boolean): Promise<Students> {
    const student = await this.studentRepo.findById(id);
    if (!student) throw new Error("Student Not Found");

    const updated = await this.studentRepo.updateBlockStatus(id, blocked);
    return updated;
  }
}
