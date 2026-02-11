import { IAssignStudentToClassDivision } from "../../interface/UseCaseInterface/ClassBase/IAssignStudentToClassDivision";
import { IClassRepository } from "../../interface/RepositoryInterface/Classrepo/IClassRepository";

export class DivisionStudentUseCase implements IAssignStudentToClassDivision {
    constructor(private repo: IClassRepository) { }

    async execute(studentId: string | string[], classId: string): Promise<boolean> {
        if (Array.isArray(studentId)) {
            return await this.repo.assignManyStudentsToClass(studentId, classId);
        }
        return await this.repo.assignStudentToClass(studentId, classId);
    }
}