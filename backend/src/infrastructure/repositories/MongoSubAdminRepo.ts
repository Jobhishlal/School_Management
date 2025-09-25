import { SubAdminRepository } from "../../domain/repositories/SubAdminCreate";
import { SubAdminModel } from "../database/models/SubAdmin";
import { SubAdminEntities } from "../../domain/entities/SubAdmin";
import { AdminRole } from "../../domain/enums/AdminRole";

export class MongoSubAdminRepo implements SubAdminRepository {
  async create(admin: SubAdminEntities): Promise<SubAdminEntities> {

    
  
    const doc = await SubAdminModel.create({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      password: admin.password,
      major_role:admin.major_role
    });

  
    return new SubAdminEntities(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.role,
      doc.password,
      doc.createdAt,
      doc.updatedAt,
      doc.blocked,
      doc.major_role
    );
  }

  async findByEmail(email: string): Promise<SubAdminEntities | null> {
     const doc = await SubAdminModel.findOne({email})
     if(!doc)return null
     return new SubAdminEntities(
        doc._id.toString(),
        doc.name,
        doc.email,
        doc.phone,
        doc.role as AdminRole,
        doc.password,
        doc.createdAt,
        doc.updatedAt,
        doc.blocked,
        doc.major_role
     )

  
  }
async findAll(): Promise<SubAdminEntities[]> {
    const docs = await SubAdminModel.find();
    return docs.map(
      (doc) =>
        new SubAdminEntities(
          doc._id.toString(),
          doc.name,
          doc.email,
          doc.phone,
          doc.role,
          doc.password,
          doc.createdAt,
          doc.updatedAt,
          doc.blocked,
          doc.major_role
        )
    );
  }

 async findByPhone(phone: string): Promise<SubAdminEntities | null> {
    const doc = await SubAdminModel.findOne({ phone });
    if (!doc) return null;
    return new SubAdminEntities(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.role as AdminRole,
      doc.password,
      doc.createdAt,
      doc.updatedAt,
      doc.blocked,
      doc.major_role
    );
  }
  async update(id: string, updates: Partial<SubAdminEntities>): Promise<SubAdminEntities | null> {
      const doc = await SubAdminModel.findByIdAndUpdate(id,updates,{new:true})
      if(!doc)return null
      return new SubAdminEntities(
        doc._id.toString(),
        doc.name,
        doc.email,
        doc.phone,
        doc.role as AdminRole,
         doc.password,
        doc.createdAt,
        doc.updatedAt,
        doc.blocked,
        doc.major_role
      )

  }
  async findById(id: string): Promise<SubAdminEntities | null> {
      const doc = await SubAdminModel.findById(id);

        if(!doc)return null
        return new SubAdminEntities(
          doc.id.toString(),
          doc.name,
          doc.email,
          doc.phone,
          doc.role as AdminRole,
           doc.password,
        doc.createdAt,
        doc.updatedAt,
        doc.blocked,
        doc.major_role
        )
  }
}
