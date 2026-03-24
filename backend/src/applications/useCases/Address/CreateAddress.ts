import { IAddrressRepository } from "../../interface/RepositoryInterface/IAddresssRepository";
import { AddressEntity } from "../../../domain/entities/Address";
import { AddressDTO } from "../../dto/AddressDTO";

export class CreatAddressUseCase {
    constructor(private readonly _data: IAddrressRepository) { }
    async execute(dto: AddressDTO): Promise<AddressEntity> {
        const address = new AddressEntity(
            "",
            dto.street,
            dto.city,
            dto.state,
            dto.pincode
        );
        const created = await this._data.create(address)
        return created
    }
}