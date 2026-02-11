import { IAddrressRepository } from "../../interface/RepositoryInterface/IAddresssRepository";
import { AddressEntity } from "../../../domain/entities/Address";

export class CreatAddressUseCase {
    constructor(private readonly data: IAddrressRepository) { }
    async execute(Address: AddressEntity): Promise<AddressEntity> {
        const created = await this.data.create(Address)
        return created
    }
}