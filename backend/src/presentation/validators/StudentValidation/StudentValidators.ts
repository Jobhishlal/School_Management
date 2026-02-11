import { Students } from "../../../domain/entities/Students";
import { StudentValidationErrors } from "../../../domain/enums/StudentError";

export function validateStudentCreate(data: any): void {
    if (!data.fullName || !data.dateOfBirth || !data.gender) {
        throw new Error(StudentValidationErrors.REQUIRED_FIELDS);
    }
    Students.validate(data);
}

export function validateStudentUpdate(data: any): void {
    // If update has fullName/gender, they shouldn't be empty if provided
    if (data.fullName !== undefined && !data.fullName.trim()) throw new Error(StudentValidationErrors.REQUIRED_FIELDS);
    if (data.gender !== undefined && !data.gender.trim()) throw new Error(StudentValidationErrors.REQUIRED_FIELDS);

    Students.validate(data);
}
