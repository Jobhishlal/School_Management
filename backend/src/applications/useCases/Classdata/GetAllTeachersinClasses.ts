import { IGetClassTeacher } from "../../interface/UseCaseInterface/ClassBase/IGetAllTeachers";
import { IClassDivisionRepository } from "../../interface/RepositoryInterface/Classrepo/IClassDivisionview";



export class GetAllTeachersInClass implements IGetClassTeacher {
  constructor(private readonly classRepo: IClassDivisionRepository) { }

  async execute(classId: string): Promise<{ teacherId: string; name: string; subjects: { name: string }[] }[]> {
    const teachers = await this.classRepo.getAllTeacher();
    return teachers;
  }
}
