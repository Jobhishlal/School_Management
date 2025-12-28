
import { IAssignTeacherOnClass } from "../../../domain/UseCaseInterface/ClassBase/IClassAssignTeacher";
import { IClassDivisionRepository } from "../../../domain/repositories/Classrepo/IClassDivisionview";


export class TeacherAssignClassUseCase implements IAssignTeacherOnClass {
  constructor(private readonly classRepo: IClassDivisionRepository) {}

  async execute(
    classId: string,
    teacherId: string
  ): Promise<"assigned" | "reassigned"> {

    const existing = await this.classRepo.getClassTeacher(classId);

    await this.classRepo.AssignClassTeacher(classId, teacherId);

    return existing ? "reassigned" : "assigned";
  }
}

