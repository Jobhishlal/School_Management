
import { AddressEntity } from "../../domain/entities/Address";
import { AddressErrors } from "../../domain/enums/AddressError";
export function validateAddress(address: AddressEntity) {
  const { street, city, state, pincode } = address;

  if (!street?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()) {
    throw new Error(AddressErrors.REQUIRED);
  }

  if (street.length < 3 || street.length > 100) {
    throw new Error(AddressErrors.STREET_LENGTH);
  }

  const cityRegex = /^[A-Za-z\s]+$/;
  if (!cityRegex.test(city)) {
    throw new Error(AddressErrors.CITY_INVALID);
  }
  if (city.length < 2 || city.length > 50) {
    throw new Error(AddressErrors.CITY_LENGTH);
  }

  const stateRegex = /^[A-Za-z\s]+$/;
  if (!stateRegex.test(state)) {
    throw new Error(AddressErrors.STATE_INVALID);
  }
  if (state.length < 2 || state.length > 50) {
    throw new Error(AddressErrors.STATE_LENGTH);
  }

  const pincodeRegex = /^[0-9]{6}$/;
  if (!pincodeRegex.test(pincode)) {
    throw new Error(AddressErrors.PINCODE_INVALID);
  }

  return true;
}