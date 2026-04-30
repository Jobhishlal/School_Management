import { AddressEntity } from "../../../domain/entities/Address";
import { IAddressUpdateUseCase } from "../../interface/UseCaseInterface/IAddressUpdateUseCase";
import { IAddrressRepository } from "../../interface/RepositoryInterface/IAddresssRepository";
import { UpdateAddressDTO } from "../../dto/AddressDTO";

export class AddresUpdateUseCase implements IAddressUpdateUseCase {
  constructor(private _updateAddressuseCase: IAddrressRepository) { }
  async execute(dto: UpdateAddressDTO): Promise<AddressEntity | null> {
    const { id, ...update } = dto;
    const updatedaddress = await this._updateAddressuseCase.update(id, update as ReturnType<typeof JSON.parse>);

    if (!updatedaddress) {
      return null;
    }

    return updatedaddress;
  }
}