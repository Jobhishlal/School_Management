import { AddressEntity } from "../../../domain/entities/Address";
import { IAddrressRepository } from "../../interface/RepositoryInterface/IAddresssRepository";

export class AddressGetAll{
    constructor (private readonly _getAll:IAddrressRepository){}
    async execute():Promise<AddressEntity[]>{
        const address= await this._getAll.getAll()
        return address
    }
}