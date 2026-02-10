import { ExamMarkEntity } from "../../domain/entities/Exam/ExamMarkEntity";
import { ExamMarkDocument } from "../database/models/ExamMarkModel";

export const toExamMarkEntity = (doc: ExamMarkDocument): ExamMarkEntity => {
  return new ExamMarkEntity(
    doc.id.toString(),
    doc.examId.toString(),
    doc.studentId.toString(),
    doc.teacherId.toString(),
    doc.marksObtained,
    doc.progress,
    doc.remarks ?? "",
    doc.concern ?? null,
    doc.concernStatus ?? null,
    doc.concernResponse ?? null,
    doc.createdAt,
    doc.updatedAt
  );
};
