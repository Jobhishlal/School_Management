export enum ParentValidationErrors {
  REQUIRED_FIELDS = "All required fields are most",
  INVALID_NAME = "Name must only contain letters and spaces",
  NAME_LENGTH = "Name must be between 2 and 50 characters",
  INVALID_CONTACT = "Contact number must be valid (10 digits)",
  INVALID_EMAIL = "Email must be valid",
  INVALID_RELATIONSHIP = "Relationship must be Father, Mother, or Guardian"
}
