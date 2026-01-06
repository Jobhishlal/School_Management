export const ExamErrorMessages = {
    UNAUTHORIZED: "Unauthorized access",
    INVALID_TEACHER_ID: "Invalid teacher ID",
    CLASS_NOT_FOUND: "Class not found",
    TEACHER_NOT_FOUND: "Teacher not found",
    TEACHER_NOT_ASSIGNED_TO_SUBJECT: "Teacher is not assigned to this subject",
    EXAM_ALREADY_EXISTS: "Exam already exists",
    INTERNAL_SERVER_ERROR: "Internal server error",
    MISSING_REQUIRED_FIELDS: "Missing required fields",
    EXAM_DATE_CANNOT_BE_IN_PAST: "Exams date cannot be in past",
} as const;
