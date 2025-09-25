import { IAddrressRepository } from "../../domain/repositories/IAddresssRepository";
import { AddressEntity } from "../../domain/entities/Address";
import { AddressInterface, AddressModel } from "../database/models/AddressModel";
import mongoose from "mongoose";

export class AddressMongoRepository implements IAddrressRepository {
  
  async create(address: AddressEntity): Promise<AddressEntity> {
   
    const newAddress = new AddressModel({
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });


    const saved = await newAddress.save();

  
    return new AddressEntity(
     (saved._id as mongoose.Types.ObjectId).toString(),  
      saved.street,
      saved.city,
      saved.state,
      saved.pincode
    );
  }

  async getAll(): Promise<AddressEntity[]> {
    const addresses: AddressInterface[] = await AddressModel.find();

    return addresses.map(
      (a) =>
        new AddressEntity(
       
          (a._id as mongoose.Types.ObjectId).toString(),  
          a.street,
          a.city,
          a.state,
          a.pincode
        )
    );
  }
}
