export enum AnnouncementErrors {
  REQUIRED = "All required fields must be provided",
  INVALID_TITLE = "Title must contain meaningful text",
  INVALID_CONTENT = "Content must contain meaningful text",
  INVALID_SCOPE = "Invalid announcement scope",
  INVALID_CLASS_ID = "Invalid class ID",
  INVALID_DIVISION = "Division must be a valid string",
  INVALID_DATE = "End time must be after active time",
  INVALID_ATTACHMENT = "Attachment must contain valid url and filename",
  INVALID_STATUS = "Invalid announcement status"
}
