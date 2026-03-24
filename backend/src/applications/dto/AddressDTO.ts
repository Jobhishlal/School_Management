export interface AddressDTO {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface UpdateAddressDTO extends Partial<AddressDTO> {
  id: string;
}
