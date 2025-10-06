export enum passwordError{
  PASSWORD_REQUIRED = "Password is required when creating a new sub-admin",
  PASSWORD_TOO_SHORT = "Password must be at least 8 characters long",
  PASSWORD_MISSING_UPPERCASE = "Password must contain at least one uppercase letter",
  PASSWORD_MISSING_LOWERCASE = "Password must contain at least one lowercase letter",
  PASSWORD_MISSING_NUMBER = "Password must contain at least one number",
  PASSWORD_MISSING_SPECIAL = "Password must contain at least one special character (@$!%*?&)",
}