export enum AdminInstituteProfileError {
  REQUIRED = "All fields are required",
  INVALID_EMAIL = "Invalid email format",
  INVALID_PHONE = "Phone number must be 10 digits and valid",
  LOGO_REQUIRED = "Logo is required when creating a new institute",
  INVALID_NAME = "Institute name must be 3–100 characters, only letters, numbers, spaces, commas, apostrophes, or hyphens",
  INVALID_PRINCIPAL_NAME = "Principal name must be 3–50 characters, only letters and spaces allowed",
  LANPHONE_NUMBER="LanPhone number must be 7 digits and valid"
}