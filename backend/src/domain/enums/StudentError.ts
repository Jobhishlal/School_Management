export enum StudentValidationErrors {
  REQUIRED_FIELDS = "All fields are required",
  INVALID_FULLNAME = "Full name must only contain letters and spaces",
  FULLNAME_LENGTH = "Full name must be between 2 and 50 characters",
  INVALID_GENDER = "Invalid gender value",
  DOB_FUTURE = "Date of birth cannot be in the future",
  DOB_AGE_LIMIT = "Student age must be between 3 and 25 years",
  INVALID_PHOTO = "Only JPG/PNG images are allowed",
}
