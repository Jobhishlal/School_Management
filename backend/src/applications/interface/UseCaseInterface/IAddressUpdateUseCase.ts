import { AddressEntity } from "../../../domain/entities/Address";
import { UpdateAddressDTO } from "../../dto/AddressDTO";
export interface IAddressUpdateUseCase {
  execute(dto: UpdateAddressDTO): Promise<AddressEntity | null>;
}