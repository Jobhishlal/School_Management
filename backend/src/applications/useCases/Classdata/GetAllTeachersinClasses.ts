import { IGetClassTeacher } from "../../../domain/UseCaseInterface/ClassBase/IGetAllTeachers";
import { IClassDivisionRepository } from "../../../domain/repositories/Classrepo/IClassDivisionview";



export class GetAllTeachersInClass implements IGetClassTeacher {
  constructor(private readonly classRepo: IClassDivisionRepository) {}

  async execute(classId: string): Promise<{ teacherId: string; name: string }[]> {
    const teachers = await this.classRepo.getAllTeacher();
    return teachers;
  }
}
