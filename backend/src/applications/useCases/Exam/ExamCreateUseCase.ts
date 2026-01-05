import { IExamCreateRepository } from "../../../domain/UseCaseInterface/Exam/IExamCreateUseCase";
import { CreateExamDTO } from "../../dto/Exam/CreateExamDTO";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { ValidateExamCreate } from "../../validators/Examvalidation/ExamCreateValidation";

export class ExamCreateUseCase implements IExamCreateRepository {
  constructor(
    private examRepo: IExamRepository,
    private classRepo: IClassRepository,
    private teacherRepo: ITeacherCreate
  ) {}

  async execute(data: CreateExamDTO): Promise<ExamEntity> {
    ValidateExamCreate(data)
   
    const classData = await this.classRepo.findById(data.classId.toString());
    if (!classData) {
        
      throw new Error("Class not found");
    }

    const teacher = await this.teacherRepo.findById(data.teacherId.toString());
    if (!teacher) {
      throw new Error("Teacher not found");
    }

   const subjectExists = teacher.subjects

  if (!subjectExists) {
  throw new Error("Teacher is not assigned to this subject");
}

   console.log("data reached usecase",data)

    return await this.examRepo.createExam(data);

  }
}
