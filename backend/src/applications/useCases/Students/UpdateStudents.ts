import { StudentDetails } from "../../interface/RepositoryInterface/Admin/IStudnetRepository";
import { Students } from "../../../domain/entities/Students";
import { IStudentUpdateUseCase } from "../../interface/UseCaseInterface/IStudentupdate";

export class UpdateStudentUseCase implements IStudentUpdateUseCase {
  constructor(private studentRepo: StudentDetails) { }

  async execute(id: string, update: Partial<Students>): Promise<Students | null> {
    const updatedStudent = await this.studentRepo.updateAll(id, update);

    if (!updatedStudent) {
      return null;
    }

    return updatedStudent;
  }
}