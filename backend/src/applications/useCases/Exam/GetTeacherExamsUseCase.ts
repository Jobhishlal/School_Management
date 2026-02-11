import { IGetTeacherExamsUseCase } from "../../interface/UseCaseInterface/Exam/IExamFindTeacherIdbase";
import { IExamRepository } from "../../../domain/repositories/Exam/IExamRepoInterface";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";

import { IExamMarkRepository } from "../../../domain/repositories/Exam/IExamMarkRepoInterface";

export class GetTeacherExamsUseCase implements IGetTeacherExamsUseCase {
  constructor(
    private examRepo: IExamRepository,
    private examMarkRepo: IExamMarkRepository
  ) { }

  async execute(teacherId: string): Promise<ExamEntity[]> {
    if (!teacherId) throw new Error("Teacher ID is required");

    const exams = await this.examRepo.getExamsByTeacher(teacherId);


    const examIds = exams.map(e => e.id);
    const concernInfo = await this.examMarkRepo.getPendingConcernsInfoByExamIds(examIds);

    return exams.map(exam => {
      const details = concernInfo[exam.id] || [];
      exam.pendingConcerns = details.length;
      exam.concerns = details;
      return exam;
    });
  }
}