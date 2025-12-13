export enum FeeStructureError{
  EMPTY_NAME = "Fee structure name cannot be empty",
  INVALID_CLASS_ID = "Invalid classId",
  INVALID_ACADEMIC_YEAR = "Invalid academic year",
  EMPTY_FEE_ITEMS = "At least one fee item is required",
  INVALID_FEE_TYPE_ID = "Invalid feeTypeId",
  INVALID_AMOUNT = "Fee amount must be greater than 0",
  INVALID_FREQUENCY = "Invalid fee frequency",
  DUPLICATE_FEE_TYPE = "Duplicate fee type in fee structure",
}