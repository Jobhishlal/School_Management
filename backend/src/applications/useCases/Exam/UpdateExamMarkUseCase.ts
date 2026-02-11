import { CreateExamMarkDTO } from "../../dto/Exam/CreateExamMarkDTO";
import { IExamMarkRepository } from "../../interface/RepositoryInterface/Exam/IExamMarkRepoInterface";
import { IExamRepository } from "../../interface/RepositoryInterface/Exam/IExamRepoInterface";
import { ExamMarkEntity } from "../../../domain/entities/Exam/ExamMarkEntity";

export class UpdateExamMarkUseCase {
    constructor(
        private examMarkRepo: IExamMarkRepository,
        private examRepo: IExamRepository
    ) { }

    async execute(teacherId: string, data: CreateExamMarkDTO) {

        const exam = await this.examRepo.findById(data.examId);
        if (!exam) {
            throw new Error("Exam not found");
        }

        if (exam.teacherId.toString() !== teacherId) {
            throw new Error("You are not allowed to update marks for this exam");
        }

        const existing = await this.examMarkRepo.findByExamAndStudent(
            data.examId,
            data.studentId
        );

        if (!existing) {
            throw new Error("Marks not found for this student. Use create instead.");
        }

        return await this.examMarkRepo.updateMark(existing.id, {
            marksObtained: data.marksObtained,
            progress: ExamMarkEntity.calculateProgress(data.marksObtained),
            remarks: data.remarks
        } as Partial<ExamMarkEntity>);
    }
}
