import { IGetTeacherAssignment } from "../../../domain/UseCaseInterface/Assignment/IGetAssigmentTeacher";
import { AssignmentEntity } from "../../../domain/entities/Assignment";
import { IAssignmentRepository } from "../../../domain/repositories/Assignment/IAssignmentRepository ";

export class GetAllTeacherAssignment implements IGetTeacherAssignment {
  constructor(private readonly assignrepo: IAssignmentRepository) {}

  async execute(teacherId: string): Promise<AssignmentEntity[]> {
    const data = await this.assignrepo.getAssignmentsByTeacher(teacherId);
    return data;
  }
}
