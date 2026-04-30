import { Class } from "../../../domain/entities/Class";

export function validateClassCreate(data: ReturnType<typeof JSON.parse>): void {
    Class.validate(data.className, data.division);
}

export function validateClassUpdate(data: ReturnType<typeof JSON.parse>): void {
    if (data.className) Class.validateClassName(data.className);
    if (data.division) Class.validateDivision(data.division);
}
