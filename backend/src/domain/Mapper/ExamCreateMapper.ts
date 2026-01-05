import { ExamDocument } from "../../infrastructure/database/models/ExamModel";
import { ExamEntity } from "../entities/Exam/ExamEntity";

export const toExamEntity = (doc: ExamDocument): ExamEntity => {
  return new ExamEntity(
    doc.id.toString(),

    doc.examId,
    doc.title,
    doc.type,

    doc.classId,
    doc.className,
    doc.division,

    doc.subject,

    doc.teacherId,
    doc.teacherName,

    doc.examDate,
    doc.startTime,
    doc.endTime,
    doc.maxMarks,

    doc.description || "",
    doc.status
  );
};
