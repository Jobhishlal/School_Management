import { AssignmentEntity } from "../../../domain/entities/Assignment";
import { AssignmentErrors } from "../../../domain/enums/AssignmentMess.ts/Assignment";

export function validateAssignmentCreate(data: any): void {
    const requiredFields = ["Assignment_Title", "description", "subject", "classId", "Assignment_date", "Assignment_Due_Date", "maxMarks", "teacherId"];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === "") {
            throw new Error(AssignmentErrors.REQUIRED);
        }
    }
    AssignmentEntity.validate(data);
}

export function validateAssignmentUpdate(data: any): void {
    AssignmentEntity.validate(data);
}
