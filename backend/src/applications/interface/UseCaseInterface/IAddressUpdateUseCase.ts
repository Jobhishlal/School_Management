import { AddressEntity } from "../../../domain/entities/Address";
export interface IAddressUpdateUseCase {
  execute(id: string, update: Partial<AddressEntity>): Promise<AddressEntity | null>;
}