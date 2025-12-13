export enum FeeTypeValidation {
  ALL_FIELDS_REQUIRED = "All required fields must be provided",
  INVALID_NAME = "Fee type name cannot be empty",
  INVALID_AMOUNT = "Default amount must be greater than 0",
  INVALID_FREQUENCY = "Invalid fee frequency",
  INVALID_OFFER = "Invalid offer configuration",
  NEGATIVE_DISCOUNT = "Discount cannot be negative",
  INVALID_FINAL_AMOUNT = "Final amount cannot be greater than default amount",
}