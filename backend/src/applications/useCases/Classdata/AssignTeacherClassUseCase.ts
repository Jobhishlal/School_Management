
import { IAssignTeacherOnClass } from "../../../domain/UseCaseInterface/ClassBase/IClassAssignTeacher";
import { IClassDivisionRepository } from "../../../domain/repositories/Classrepo/IClassDivisionview";


export class TeacherAssignClassUseCase implements IAssignTeacherOnClass{
    constructor(private readonly classRepo : IClassDivisionRepository){}
    async execute(classId: string, teacherId: string): Promise<boolean> {
        const updated = await this.classRepo.AssignClassTeacher(classId,teacherId)
        return updated
    
    }
}