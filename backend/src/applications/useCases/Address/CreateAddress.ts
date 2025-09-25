import { IAddrressRepository } from "../../../domain/repositories/IAddresssRepository";
import { AddressEntity } from "../../../domain/entities/Address";
import { validateAddress } from "../../validators/AddressValidate";

export class CreatAddressUseCase{
    constructor(private readonly data:IAddrressRepository){}
    async execute(Address:AddressEntity):Promise<AddressEntity>{
        validateAddress(Address)
        const created = await this.data.create(Address)
        return created
    }
}