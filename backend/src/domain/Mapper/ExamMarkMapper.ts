import { ExamMarkEntity } from "../entities/Exam/ExamMarkEntity";
import { ExamMarkDocument } from "../../infrastructure/database/models/ExamMarkModel";

export const toExamMarkEntity = (doc: ExamMarkDocument): ExamMarkEntity => {
  return new ExamMarkEntity(
    doc.id.toString(),
    doc.examId,
    doc.studentId,
    doc.teacherId,
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
