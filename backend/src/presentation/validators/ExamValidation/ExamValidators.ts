import { ExamEntity } from "../../../domain/entities/Exam/ExamEntity";
import { ExamErrors } from "../../../domain/enums/ExamErrorMessages/ExamError";

export function validateExamCreate(data: any): void {
    if (
        !data.title ||
        !data.type ||
        !data.classId ||
        !data.teacherId ||
        !data.subject ||
        !data.examDate ||
        !data.startTime ||
        !data.endTime ||
        data.maxMarks === undefined
    ) {
        throw new Error(ExamErrors.REQUIRED);
    }
    ExamEntity.validate(data);
}

export function validateExamUpdate(data: any): void {
    ExamEntity.validate(data);
}
