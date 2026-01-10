import { CreateLeaveDTO } from "../../dto/LeaveManagement/CreateLeaveManagementDTO";
import { LeaveError } from "../../../domain/enums/LeaveError";

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

    if (!data.reason.trim()) {
        throw new Error(LeaveError.REASON_REQUIRED);
    }

    return true;
}

