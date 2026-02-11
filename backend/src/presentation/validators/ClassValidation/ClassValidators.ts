import { Class } from "../../../domain/entities/Class";

export function validateClassCreate(data: any): void {
    Class.validate(data.className, data.division);
}

export function validateClassUpdate(data: any): void {
    if (data.className) Class.validateClassName(data.className);
    if (data.division) Class.validateDivision(data.division);
}
