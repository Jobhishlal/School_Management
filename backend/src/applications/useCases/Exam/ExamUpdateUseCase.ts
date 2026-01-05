import { Types } from "mongoose";
import { IExamUpdateTeacherUseCase } from "../../../domain/UseCaseInterface/Exam/IExamUpdateUseCase";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";
import { UpdateExamDTO } from "../../dto/Exam/UpdateExamDTO";
import { ValidateExamUpdate } from "../../validators/Examvalidation/ExamUpdateValidation";

export class ExamUpdateTeacherUseCase implements IExamUpdateTeacherUseCase {
  constructor(
    private examRepo: IExamRepository,
    private teacherRepo: ITeacherCreate
  ) {}

  async execute(id: string, data: UpdateExamDTO): Promise<ExamEntity> {
    ValidateExamUpdate(data)

    if (data.teacherId && data.subject) {
      const teacher = await this.teacherRepo.findById(data.teacherId.toString());
      console.log("teacherId",teacher)
      if (!teacher) throw new Error("Teacher not found");

      const hasSubject = teacher.subjects?.some(s => s.name === data.subject);
      if (!hasSubject) throw new Error("Teacher is not assigned to this subject");
    }

    const updatedExam = await this.examRepo.updateexam(id, data);
    console.log("dhaskfhkdankl",updatedExam)

    if (!updatedExam) throw new Error("Exam not found");

    return updatedExam;
  }
}

