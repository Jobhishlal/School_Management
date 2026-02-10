import { ExamDocument } from "../database/models/ExamModel";
import { ExamEntity } from "../../domain/entities/Exam/ExamEntity";

export const toExamEntity = (doc: ExamDocument): ExamEntity => {
  return new ExamEntity(
    doc.id.toString(),

    doc.examId,
    doc.title,
    doc.type,

    doc.classId.toString(),
    doc.className,
    doc.division,

    doc.subject,

    doc.teacherId.toString(),
    doc.teacherName,

    doc.examDate,
    doc.startTime,
    doc.endTime,
    doc.maxMarks,
    doc.passMarks,

    doc.description || "",
    doc.status
  );
};
