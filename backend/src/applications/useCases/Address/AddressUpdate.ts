import { AddressEntity } from "../../../domain/entities/Address";
import { IAddressUpdateUseCase } from "../../../domain/UseCaseInterface/IAddressUpdateUseCase";
import { IAddrressRepository } from "../../../domain/repositories/IAddresssRepository";
import { validateAddressUpdate } from "../../validators/AddressValidate";


export class AddresUpdateUseCase implements IAddressUpdateUseCase{
    constructor(private updateAddressuseCase:IAddrressRepository){}
      async execute(id: string, update: Partial<AddressEntity>): Promise<AddressEntity | null> {
        
         validateAddressUpdate(update)
         const updatedaddress = await this.updateAddressuseCase.update(id, update);
     
         if (!updatedaddress) {
     
           return null;
         }
     
         return updatedaddress;
       }
}