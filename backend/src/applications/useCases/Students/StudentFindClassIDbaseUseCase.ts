import { IGetStudentsByClassUseCase } from "../../interface/UseCaseInterface/StudentCreate/IStudentFindClassBase";
import { Students } from "../../../domain/entities/Students";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";

export class StudentFindClassBaseUseCase implements IGetStudentsByClassUseCase{
    constructor(
        private readonly repo:StudentDetails,
        private readonly classrepo:IClassRepository
    
    ){}

    async execute(classId: string, teacherId?: string): Promise<Students[]> {
        const classData = await this.classrepo.findById(classId)
    if (!classData) {
      throw new Error("Class not found");
    }

 
    if (
      teacherId &&
      classData.classTeacher?.toString() !== teacherId.toString()
    ) {
      throw new Error("You are not authorized to view this class");
    }

    const students = await this.repo.findByStudentClassIdBase(classId);

    
    if (!students.length) {
      throw new Error("No students found for this class");
    }

    return students;
    
       }
    }

