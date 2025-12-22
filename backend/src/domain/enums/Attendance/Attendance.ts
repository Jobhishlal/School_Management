export enum AttendanceErrors {
  REQUIRED = "All required fields must be provided",
  INVALID_ID = "Invalid ID format",
  INVALID_SESSION = "Invalid attendance session",
  INVALID_STATUS = "Invalid attendance status",
  DUPLICATE_STUDENT = "Duplicate student in attendance list",
  EMPTY_ATTENDANCE = "Attendance list cannot be empty",
  INVALID_STUDENT = "Student does not belong to this class",
  ALREADY_TAKEN = "Attendance already taken for this session",
  INVALID_TIME = "Attendance can only be taken during school hours",
  INVALID_DATE = "Attendance can only be taken for today",
  UNAUTHORIZED = "You are not authorized to take attendance",
  REMARK_LENGTH = "Remarks length exceeded",
}
