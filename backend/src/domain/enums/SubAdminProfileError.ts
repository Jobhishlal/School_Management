export enum SubAdminProfileError {
  REQUIRED = "Name, email, and phone are required",
  INVALID_NAME = "Name must be 3–50 characters, only letters and spaces allowed",
  INVALID_EMAIL = "Invalid email format",
  INVALID_PHONE = "Phone number must be 10 digits and valid",

  INVALID_DATEOFBIRTH = "Invalid date of birth",
  INVALID_GENDER = "Gender must be Male, Female, or Other",
  DOB_FUTURE = "Date of birth cannot be in the future",
  DOB_AGE_LIMIT = "Staff age  age must be between 25 and 50 years",
}
