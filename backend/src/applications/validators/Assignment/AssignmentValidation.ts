import { AssignmentErrors } from "../../../domain/enums/AssignmentMess.ts/Assignment";
import { CreateAssignmentDTO } from "../../dto/AssignmentDTO ";
import { Types } from "mongoose";

export function ValidationAssignment(data:CreateAssignmentDTO){
    const RequireFilds = ["Assignment_Title","description","subject","classId","Assignment_date","Assignment_Due_Date","maxMarks","teacherId"];
     for (const field of RequireFilds) {
    if (data[field as keyof CreateAssignmentDTO] === undefined || data[field as keyof CreateAssignmentDTO] === "") {
      throw new Error(AssignmentErrors.REQUIRED);
    }
    }


      if (data.Assignment_Title.length < 3 || data.Assignment_Title.length > 100) {
      throw new Error(AssignmentErrors.TITLE_LENGTH);
      }

      if (data.description.length < 5 || data.description.length > 1000) {
       throw new Error(AssignmentErrors.DESCRIPTION_LENGTH);
      }


       if (data.subject.length < 2 || data.subject.length > 50) {
    throw new Error(AssignmentErrors.SUBJECT_LENGTH);
  }


    const assignDate = new Date(data.Assignment_date);
  const dueDate = new Date(data.Assignment_Due_Date);
  if (dueDate < assignDate) {
    throw new Error(AssignmentErrors.INVALID_DATE);
  }

  if ( data.maxMarks <= 0) {
    throw new Error(AssignmentErrors.INVALID_MAX_MARKS);
  }

  if (!Types.ObjectId.isValid(data.classId)) {
    throw new Error(`${AssignmentErrors.INVALID_ID}: classId`);
  }
  if (!Types.ObjectId.isValid(data.teacherId)) {
    throw new Error(`${AssignmentErrors.INVALID_ID}: teacherId`);
  }


  if (data.attachments) {
    data.attachments.forEach(file => {
      if (!file.url || !file.fileName) {
        throw new Error(AssignmentErrors.INVALID_ATTACHMENT);
      }
    });
  }

  return true;

}
