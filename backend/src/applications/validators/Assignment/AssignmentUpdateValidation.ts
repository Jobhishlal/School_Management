
import { CreateAssignmentDTO } from "../../dto/AssignmentDTO ";
import { Types } from "mongoose";
import { AssignmentErrors } from "../../../domain/enums/AssignmentMess.ts/Assignment";

export function ValidateAssignmentUpdate(data: Partial<CreateAssignmentDTO>) {
 
  if (data.Assignment_Title !== undefined && data.Assignment_Title.trim() === "") {
    throw new Error("Assignment title cannot be empty");
  }

  if (data.description !== undefined && data.description.trim() === "") {
    throw new Error("Description cannot be empty");
  }

  if (data.subject !== undefined && data.subject.trim() === "") {
    throw new Error("Subject cannot be empty");
  }

  if (data.classId !== undefined && !Types.ObjectId.isValid(data.classId)) {
    throw new Error(`${AssignmentErrors.INVALID_ID}: classId`);
  }

  if (data.teacherId !== undefined && !Types.ObjectId.isValid(data.teacherId)) {
    throw new Error(`${AssignmentErrors.INVALID_ID}: teacherId`);
  }

  if (data.maxMarks !== undefined && Number(data.maxMarks) <= 0) {
    throw new Error(AssignmentErrors.INVALID_MAX_MARKS);
  }

  if (data.Assignment_date && data.Assignment_Due_Date) {
    const assignDate = new Date(data.Assignment_date);
    const dueDate = new Date(data.Assignment_Due_Date);
    if (dueDate < assignDate) throw new Error(AssignmentErrors.INVALID_DATE);
  }

  if (data.attachments) {
    data.attachments.forEach(file => {
      if (!file.url || !file.fileName) throw new Error(AssignmentErrors.INVALID_ATTACHMENT);
    });
  }

  return true;
}
