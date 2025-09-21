
import { AddressEntity } from "../entities/Address";

export interface IAddrressRepository{
  getAll():Promise<AddressEntity[]> ;
  create(Address:AddressEntity):Promise<AddressEntity> 


}