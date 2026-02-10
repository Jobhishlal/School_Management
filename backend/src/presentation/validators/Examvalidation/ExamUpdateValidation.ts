import { Types } from "mongoose";
import { UpdateExamDTO } from "../../../applications/dto/Exam/UpdateExamDTO";
import { ExamErrors } from "../../../domain/enums/ExamErrorMessages/ExamError";

const EXAM_TYPES = ["UNIT_TEST", "MIDTERM", "FINAL"];

export function ValidateExamUpdate(data: UpdateExamDTO) {

  if (data.classId && !Types.ObjectId.isValid(data.classId)) {
    throw new Error(`${ExamErrors.INVALID_ID}: classId`);
  }

  if (data.teacherId && !Types.ObjectId.isValid(data.teacherId)) {
    throw new Error(`${ExamErrors.INVALID_ID}: teacherId`);
  }

  if (data.type && !EXAM_TYPES.includes(data.type)) {
    throw new Error(ExamErrors.INVALID_EXAM_TYPE);
  }

  if (data.examDate) {
    const date = new Date(data.examDate);
    if (isNaN(date.getTime())) {
      throw new Error(ExamErrors.INVALID_DATE);
    }
  }

  if (data.startTime || data.endTime) {
    if (!data.startTime || !data.endTime) {
      throw new Error(ExamErrors.INVALID_TIME_RANGE);
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (
      !timeRegex.test(data.startTime) ||
      !timeRegex.test(data.endTime)
    ) {
      throw new Error(ExamErrors.INVALID_TIME);
    }

    const [sh, sm] = data.startTime.split(":").map(Number);
    const [eh, em] = data.endTime.split(":").map(Number);

    if (eh * 60 + em <= sh * 60 + sm) {
      throw new Error(ExamErrors.INVALID_TIME_RANGE);
    }
  }

  if (data.maxMarks !== undefined && data.maxMarks <= 0) {
    throw new Error(ExamErrors.INVALID_MARKS);
  }

  if (data.description && data.description.length > 500) {
    throw new Error(ExamErrors.DESCRIPTION_LENGTH);
  }

  return true;
}
