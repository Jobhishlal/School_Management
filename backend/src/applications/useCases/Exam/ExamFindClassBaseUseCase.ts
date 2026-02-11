import { IExamRepository } from "../../interface/RepositoryInterface/Exam/IExamRepoInterface";
import { IExamFindByClassUseCase } from "../../interface/UseCaseInterface/Exam/IExamFindClassBase";
import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";



export class ExamFindClassBase implements IExamFindByClassUseCase{
    constructor(
        private repo:IExamRepository,
    ){}
    async execute(params: { classId: string; teacherId: string; }): Promise<ExamEntity[]> {
        const { classId, teacherId } = params;

    if (!classId || !teacherId) {
      throw new Error("classId and teacherId are required");
    }

    const exams = await this.repo.findByClassAndTeacher(
      classId,
      teacherId
    );

    return exams;

    }
}