import { FeeStructureError } from "../../../domain/enums/FeeStructure/FeeStructure";
import { CreateFeeStructureDTO } from "../../../applications/dto/FeeDTO/CreateFeeStructureDTO ";
import { Types } from "mongoose";

export function CreateValidationFeeStructure(data: CreateFeeStructureDTO) {
    if (!data.name || !data.academicYear || !data.classId || !data.notes) {
        throw new Error(FeeStructureError.REQUIRED_FIELDS)
    }

    if (!data.name || data.name.trim() === "") {
        throw new Error(FeeStructureError.EMPTY_NAME);
    }

    if (!Types.ObjectId.isValid(data.classId)) {
        throw new Error(FeeStructureError.INVALID_CLASS_ID);
    }
    if (!/^\d{4}-\d{4}$/.test(data.academicYear)) {
        throw new Error(FeeStructureError.INVALID_ACADEMIC_YEAR);
    }


    if (!data.feeItems || data.feeItems.length === 0) {
        throw new Error(FeeStructureError.EMPTY_FEE_ITEMS);
    }

    const seenFeeTypes = new Set<String>()
    data.feeItems.forEach((item, index) => {

        if (!Types.ObjectId.isValid(item.feeTypeId)) {
            throw new Error(`${FeeStructureError.INVALID_FEE_TYPE_ID} at index ${index}`);
        }

        if (seenFeeTypes.has(item.feeTypeId)) {
            throw new Error(FeeStructureError.DUPLICATE_FEE_TYPE);
        }
        seenFeeTypes.add(item.feeTypeId);

        if (Number(item.amount) <= 0) {
            throw new Error(FeeStructureError.INVALID_AMOUNT);
        }

        if (item.isOptional === undefined) {
            throw new Error("isOptional is required");
        }
        if (!data.startDate) {
            throw new Error(FeeStructureError.START_DATE_REQUIRED);
        }

        if (!data.expiryDate) {
            throw new Error(FeeStructureError.EXPIRY_DATE_REQUIRED);
        }

        const start = new Date(data.startDate);
        const expiry = new Date(data.expiryDate);

        if (isNaN(start.getTime())) {
            throw new Error(FeeStructureError.INVALID_START_DATE);
        }

        if (isNaN(expiry.getTime())) {
            throw new Error(FeeStructureError.INVALID_EXPIRY_DATE);
        }

        if (expiry <= start) {
            throw new Error(FeeStructureError.EXPIRY_BEFORE_START);
        }
    });
    return true
}
