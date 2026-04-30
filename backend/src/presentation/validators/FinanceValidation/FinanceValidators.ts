import { FeeStructure } from "../../../domain/entities/FeeType/FeeStructure";
import { Expense } from "../../../domain/entities/FeeType/Expense";
import { FeeType } from "../../../domain/entities/FeeType/FeeType";
import { FeeStructureError } from "../../../domain/enums/FeeStructure/FeeStructure";

export function validateFeeStructureCreate(data: ReturnType<typeof JSON.parse>): void {
    if (!data.name || !data.academicYear || !data.classId || !data.notes) {
        throw new Error(FeeStructureError.REQUIRED_FIELDS);
    }
    FeeStructure.validate(data);
}

export function validateFeeStructureUpdate(data: ReturnType<typeof JSON.parse>): void {
    FeeStructure.validate(data);
}

export function validateExpenseCreate(data: ReturnType<typeof JSON.parse>): void {
    if (!data.title || !data.amount || !data.expenseDate || !data.paymentMode) {
        throw new Error("Missing required fields for expense");
    }
    Expense.validate(data);
}

export function validateExpenseUpdate(data: ReturnType<typeof JSON.parse>): void {
    Expense.validate(data);
}

export function validateFeeTypeCreate(data: ReturnType<typeof JSON.parse>): void {
    if (!data.name || data.defaultAmount === undefined || !data.frequency) {
        throw new Error("Missing required fields for fee type");
    }
    FeeType.validate(data);
}
