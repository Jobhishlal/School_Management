import { IGetTeacherExamsUseCase } from "../../../domain/UseCaseInterface/Exam/IExamFindTeacherIdbase";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";

export class GetTeacherExamsUseCase implements IGetTeacherExamsUseCase {
  constructor(private examRepo: IExamRepository) {}

  async execute(teacherId: string): Promise<ExamEntity[]> {
    if (!teacherId) throw new Error("Teacher ID is required");

    const exams = await this.examRepo.getExamsByTeacher(teacherId);

    return exams;
  }
}