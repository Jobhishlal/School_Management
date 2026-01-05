import { Types } from "mongoose";
import { CreateExamDTO } from "../../dto/Exam/CreateExamDTO";
import { ExamErrors } from "../../../domain/enums/ExamErrorMessages/ExamError";

const EXAM_TYPES = ["UNIT_TEST", "MIDTERM", "FINAL"];

export function ValidateExamCreate(data: CreateExamDTO) {

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

  if (!Types.ObjectId.isValid(data.teacherId)) {
    throw new Error(`${ExamErrors.INVALID_ID}: teacherId`);
  }

  if (!EXAM_TYPES.includes(data.type)) {
    throw new Error(ExamErrors.INVALID_EXAM_TYPE);
  }

  const examDate = new Date(data.examDate);
  if (isNaN(examDate.getTime())) {
    throw new Error(ExamErrors.INVALID_DATE);
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(data.startTime) || !timeRegex.test(data.endTime)) {
    throw new Error(ExamErrors.INVALID_TIME);
  }

  const [sh, sm] = data.startTime.split(":").map(Number);
  const [eh, em] = data.endTime.split(":").map(Number);

  if (eh * 60 + em <= sh * 60 + sm) {
    throw new Error(ExamErrors.INVALID_TIME_RANGE);
  }

  if (typeof data.maxMarks !== "number" || data.maxMarks <= 0) {
    throw new Error(ExamErrors.INVALID_MARKS);
  }

  if (typeof data.subject !== "string" || data.subject.trim().length === 0) {
    throw new Error(ExamErrors.INVALID_SUBJECT);
  }

  if (data.description && data.description.length > 500) {
    throw new Error(ExamErrors.DESCRIPTION_LENGTH);
  }

  return true;
}
