import { SubAdminRepository } from "../../applications/repositories/SubAdminCreate";
import { SubAdminModel } from "../database/models/SubAdmin";
import { SubAdminEntities } from "../../domain/entities/SubAdmin";
import { AdminRole } from "../../domain/entities/AdminRole";

export class MongoSubAdminRepo implements SubAdminRepository {
  async create(admin: SubAdminEntities): Promise<SubAdminEntities> {
  
    const doc = await SubAdminModel.create({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      password: admin.password,
    });

  
    return new SubAdminEntities(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.role,
      doc.password,
      doc.createdAt,
      doc.updatedAt
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
        doc.updatedAt
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
          doc.updatedAt
        )
    );
  }
}
