import { IStudentExamListUseCase } from "../../interface/UseCaseInterface/Exam/IExamClassbaseviewusecase";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";

export class Examclassbaseviewusecase implements IStudentExamListUseCase {
  constructor(
    private repo: IExamRepository,
    private studentdetails: StudentDetails
  ) {}

  async execute(studentId: string): Promise<ExamEntity[]> {
    
    const student = await this.studentdetails.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

  
    const classId = student.classId;

    
    return await this.repo.getExamsByTeacherWithStudents(classId);
  }
}
