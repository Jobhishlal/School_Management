import { IParentRepository } from "../../domain/repositories/IParentsRepository";
import { ParentEntity } from "../../domain/entities/Parents";
import { ParentInterface, ParentModel } from "../database/models/ParentsModel";
import mongoose from "mongoose";

export class ParentMongoRepository implements IParentRepository { 

    async getAll(): Promise<ParentEntity[]> {
        const parents: ParentInterface[] = await ParentModel.find();

    
        return parents.map(
            p =>
                new ParentEntity(
                     (p._id as mongoose.Types.ObjectId).toString(),   
                    p.name,
                    p.contactNumber,
                    p.whatsappNumber,
                    p.email || "",
                    p.relationship
                )
        );
    }

    async create(data: Partial<ParentEntity>): Promise<ParentEntity> {
  
        const parentDoc = new ParentModel({
            name: data.name,
            contactNumber: data.contactNumber,
            whatsappNumber: data.whatsappNumber,
            email: data.email,
            relationship: data.relationship
        });

        const saved = await parentDoc.save();

 
        return new ParentEntity(
           (saved._id as mongoose.Types.ObjectId).toString(),  
            saved.name,
            saved.contactNumber,
            saved.whatsappNumber,
            saved.email || "",
            saved.relationship
        );
    }
    async getById(id: string): Promise<ParentEntity | null> {
  const parent = await ParentModel.findById(id).lean<ParentInterface | null>();
  if (!parent) return null;

  return new ParentEntity(
    (parent._id as mongoose.Types.ObjectId).toString(),
    parent.name,
    parent.contactNumber,
    parent.whatsappNumber,
    parent.email || "",
    parent.relationship
  );
}
  async findByEmail(email: string): Promise<ParentEntity | null> {
  if (!email || email.trim() === "") return null;

  const parent = await ParentModel.findOne({
    email: { $regex: `^${email.trim()}$`, $options: "i" } 
  }).lean<ParentInterface | null>();

  if (!parent) return null;

  return new ParentEntity(
    (parent._id as mongoose.Types.ObjectId).toString(),
    parent.name,
    parent.contactNumber,
    parent.whatsappNumber,
    parent.email || "",
    parent.relationship
  );
}


    async findByContactNumber(contactNumber: string): Promise<ParentEntity | null> {
        const parent = await ParentModel.findOne({ whatsappNumber: contactNumber }).lean<ParentInterface | null>();
        if (!parent) return null;
        return new ParentEntity(
            (parent._id as mongoose.Types.ObjectId).toString(),
            parent.name,
            parent.contactNumber,
            parent.whatsappNumber,
            parent.email || "",
            parent.relationship
        );
    }

}
