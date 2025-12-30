import { AttendanceErrorEnums } from "../../../shared/constants/AttendanceErrorEnums";

export const ValidateParentAttendanceFilter = (startDate: Date, endDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);


    if (!startDate) {
        throw new Error(AttendanceErrorEnums.START_DATE_REQUIRED);
    }

    if (!endDate) {
        throw new Error(AttendanceErrorEnums.END_DATE_REQUIRED);
    }

    if (end > today) {
        throw new Error(AttendanceErrorEnums.FUTURE_DATE_NOT_ALLOWED);
    }

    if (start > end) {
        throw new Error(AttendanceErrorEnums.INVALID_DATE_RANGE);
    }
};
