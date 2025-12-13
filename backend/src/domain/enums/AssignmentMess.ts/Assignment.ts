export enum AssignmentErrors {
  REQUIRED = "All required fields must be provided",
  TITLE_LENGTH = "Title must be between 3 and 100 characters",
  DESCRIPTION_LENGTH = "Description must be between 5 and 1000 characters",
  SUBJECT_LENGTH = "Subject must be between 2 and 50 characters",
  INVALID_CLASS = "Class is invalid",
  INVALID_DIVISION = "Division is invalid",
  INVALID_DATE = "Due date must be after or equal to assignment date",
  INVALID_MAX_MARKS = "Max marks must be greater than 0",
  INVALID_ID = "Invalid ID format",
  INVALID_ATTACHMENT = "Attachments must be valid files",
}
