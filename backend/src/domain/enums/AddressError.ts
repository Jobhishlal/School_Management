export enum AddressErrors {
  REQUIRED = "All address fields are required",
  STREET_LENGTH = "Street must be between 3 and 100 characters",
  CITY_INVALID = "City must only contain letters and spaces",
  CITY_LENGTH = "City must be between 2 and 50 characters",
  STATE_INVALID = "State must only contain letters and spaces",
  STATE_LENGTH = "State must be between 2 and 50 characters",
  PINCODE_INVALID = "Pincode must be a 6-digit number",
}
