import { CreateLeaveDTO } from "../../dto/LeaveManagement/CreateLeaveManagementDTO";
import { LeaveError } from "../../../domain/enums/LeaveError";

const REASON_REGEX = /^[a-zA-Z\s.,]+$/;


export function ValidateLeaveCreate(data: CreateLeaveDTO) {
    if (
        !data.leaveType ||
        !data.startDate ||
        !data.endDate ||
        !data.reason
    ) {
        throw new Error(LeaveError.REQUIRED);
    }

    const validLeaveTypes = ["CASUAL", "SICK", "PAID", "UNPAID", "EXTRA"];
    if (!validLeaveTypes.includes(data.leaveType)) {
        throw new Error(LeaveError.INVALID_LEAVE_TYPE);
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error(LeaveError.INVALID_DATE);
    }

    if (startDate > endDate) {
        throw new Error(LeaveError.INVALID_DATE_RANGE);
    }

    // Check for past date (compare with Today at 00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
        throw new Error(LeaveError.PAST_DATE);
    }

    if (!data.reason.trim()) {
        throw new Error(LeaveError.REASON_REQUIRED);
    }

    if (!REASON_REGEX.test(data.reason)) {
        throw new Error(LeaveError.INVALID_REASON_FORMAT);
    }

    return true;
}

