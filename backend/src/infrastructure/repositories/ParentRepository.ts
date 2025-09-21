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
}
