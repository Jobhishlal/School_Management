
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


export function validateAddressUpdate(update: Partial<AddressEntity>) {
  if (update.street !== undefined) {
    if (!update.street.trim()) throw new Error(AddressErrors.REQUIRED);
    if (update.street.length < 3 || update.street.length > 100) {
      throw new Error(AddressErrors.STREET_LENGTH);
    }
  }

  if (update.city !== undefined) {
    if (!/^[A-Za-z\s]+$/.test(update.city)) {
      throw new Error(AddressErrors.CITY_INVALID);
    }
    if (update.city.length < 2 || update.city.length > 50) {
      throw new Error(AddressErrors.CITY_LENGTH);
    }
  }

  if (update.state !== undefined) {
    if (!/^[A-Za-z\s]+$/.test(update.state)) {
      throw new Error(AddressErrors.STATE_INVALID);
    }
    if (update.state.length < 2 || update.state.length > 50) {
      throw new Error(AddressErrors.STATE_LENGTH);
    }
  }

  if (update.pincode !== undefined) {
    if (!/^[0-9]{6}$/.test(update.pincode)) {
      throw new Error(AddressErrors.PINCODE_INVALID);
    }
  }

  return true;
}