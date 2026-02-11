import { AddressEntity } from "../../../domain/entities/Address";
import { IAddressUpdateUseCase } from "../../interface/UseCaseInterface/IAddressUpdateUseCase";
import { IAddrressRepository } from "../../interface/RepositoryInterface/IAddresssRepository";

export class AddresUpdateUseCase implements IAddressUpdateUseCase {
  constructor(private updateAddressuseCase: IAddrressRepository) { }
  async execute(id: string, update: Partial<AddressEntity>): Promise<AddressEntity | null> {
    const updatedaddress = await this.updateAddressuseCase.update(id, update);

    if (!updatedaddress) {
      return null;
    }

    return updatedaddress;
  }
}