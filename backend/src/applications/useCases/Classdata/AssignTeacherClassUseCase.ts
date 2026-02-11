import { IAssignTeacherOnClass } from "../../interface/UseCaseInterface/ClassBase/IClassAssignTeacher";
import { IClassDivisionRepository } from "../../../domain/repositories/Classrepo/IClassDivisionview";

export class TeacherAssignClassUseCase implements IAssignTeacherOnClass {
  constructor(private readonly classRepo: IClassDivisionRepository) {}

  async execute(
    classId: string,
    teacherId: string
  ): Promise<"assigned" | "reassigned"> {

   
    const classData = await this.classRepo.getClassTeacher(classId);
    
  
    const existingTeacherClass = await this.classRepo.getClassByTeacherId(teacherId);

    if (
      existingTeacherClass && 
      existingTeacherClass._id !== classId 
    ) {
      throw new Error("This teacher is already assigned as a class teacher to another class");
    }

    await this.classRepo.AssignClassTeacher(classId, teacherId);

    return classData ? "reassigned" : "assigned";
  }
}
