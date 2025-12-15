export enum ExpenseValidation {
  ALL_FIELDS_REQUIRED = "All required fields must be provided",
  INVALID_TITLE = "Expense title is invalid",
  INVALID_AMOUNT = "Expense amount must be greater than zero",
  INVALID_DATE = "Expense date is invalid",
  FUTURE_DATE_NOT_ALLOWED = "Expense date cannot be in the future",
  INVALID_PAYMENT_MODE = "Invalid payment mode",
  INVALID_CREATED_BY = "Created by is required",
  INVALID_DESCRIPTION = "Description must be a string"
}
