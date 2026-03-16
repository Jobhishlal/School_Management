import { IAddrressRepository } from "../../interface/RepositoryInterface/IAddresssRepository";
import { AddressEntity } from "../../../domain/entities/Address";

export class CreatAddressUseCase {
    constructor(private readonly _data: IAddrressRepository) { }
    async execute(Address: AddressEntity): Promise<AddressEntity> {
        const created = await this._data.create(Address)
        return created
    }
}