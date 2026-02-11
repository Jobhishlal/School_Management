import { ParentEntity } from "../../../domain/entities/Parents";
import { ParentValidationErrors } from "../../../domain/enums/ParentValidateError";

export function validateParentCreate(data: any): void {
    if (!data.name || !data.contactNumber) {
        throw new Error(ParentValidationErrors.REQUIRED_FIELDS);
    }
    ParentEntity.validate(data);
}

export function validateParentUpdate(data: any): void {
    ParentEntity.validate(data);
}
