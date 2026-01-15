export enum LeaveError {
    REQUIRED = "All fields are required",
    INVALID_LEAVE_TYPE = "Invalid leave type",
    INVALID_DATE = "Invalid date format",
    INVALID_DATE_RANGE = "Start date cannot be after end date",
    REASON_REQUIRED = "Reason is required",
    PAST_DATE = "Start date cannot be in the past",
    INVALID_REASON_FORMAT = "Reason must contain only alphabets/characters"
}
