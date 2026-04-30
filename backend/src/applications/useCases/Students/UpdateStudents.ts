import { StudentDetails } from "../../interface/RepositoryInterface/Admin/IStudnetRepository";
import { Students } from "../../../domain/entities/Students";
import { IStudentUpdateUseCase } from "../../interface/UseCaseInterface/IStudentupdate";
import { UpdateStudentDTO } from "../../dto/StudentDTO";

export class UpdateStudentUseCase implements IStudentUpdateUseCase {
  constructor(private studentRepo: StudentDetails) { }

  async execute(dto: UpdateStudentDTO): Promise<Students | null> {
    const { id, ...updates } = dto;
    const updatedStudent = await this.studentRepo.updateAll(id, updates as ReturnType<typeof JSON.parse>);

    if (!updatedStudent) {
      return null;
    }

    return updatedStudent;
  }
}