import { AddressEntity } from "../../../domain/entities/Address";
import { IAddrressRepository } from "../../../domain/repositories/IAddresssRepository";

export class AddressGetAll{
    constructor (private readonly getAll:IAddrressRepository){}
    async execute():Promise<AddressEntity[]>{
        const address= await this.getAll.getAll()
        return address
    }
}