
import { SubAdminRepository } from "../../domain/repositories/SubAdminCreate";
import { SubAdminModel } from "../database/models/SubAdmin";
import { SubAdminEntities } from "../../domain/entities/SubAdmin";
import { AdminRole } from "../../domain/enums/AdminRole";
import { Types, Document } from "mongoose";
import bcrypt from 'bcrypt'


interface AddressDocument {
  _id: Types.ObjectId;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export class MongoSubAdminRepo implements SubAdminRepository {
  async create(admin: SubAdminEntities): Promise<SubAdminEntities> {
    const doc = await SubAdminModel.create({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      major_role: admin.major_role,
      password: admin.password,
      blocked: admin.blocked,
      dateOfBirth: admin.dateOfBirth,
      gender: admin.gender,
      documents: admin.documents || [],
      photo: admin.photo || [],
      address: typeof admin.address === "string" ? admin.address : admin.address?._id,
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
      doc.major_role,
      doc.dateOfBirth,
      doc.gender,
      doc.documents,
      doc.address ? doc.address.toString() : undefined, 
      doc.photo
    );
  }

  async findByEmail(email: string): Promise<SubAdminEntities | null> {
    const doc = await SubAdminModel.findOne({ email }).populate<{ address: AddressDocument }>("address");
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
      doc.major_role,
      doc.dateOfBirth,
      doc.gender,
      doc.documents,
      doc.address
        ? {
            _id: doc.address._id.toString(),
            street: doc.address.street,
            city: doc.address.city,
            state: doc.address.state,
            pincode: doc.address.pincode,
          }
        : undefined,
      doc.photo
    );
  }

  async findByPhone(phone: string): Promise<SubAdminEntities | null> {
    const doc = await SubAdminModel.findOne({ phone }).populate<{ address: AddressDocument }>("address");
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
      doc.major_role,
      doc.dateOfBirth,
      doc.gender,
      doc.documents,
      doc.address
        ? {
            _id: doc.address._id.toString(),
            street: doc.address.street,
            city: doc.address.city,
            state: doc.address.state,
            pincode: doc.address.pincode,
          }
        : undefined,
      doc.photo
    );
  }

  async findAll(): Promise<SubAdminEntities[]> {
    const docs = await SubAdminModel.find().populate<{ address: AddressDocument }>("address");
    return docs.map((doc) =>
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
        doc.major_role,
        doc.dateOfBirth,
        doc.gender,
        doc.documents,
        doc.address
          ? {
              _id: doc.address._id.toString(),
              street: doc.address.street,
              city: doc.address.city,
              state: doc.address.state,
              pincode: doc.address.pincode,
            }
          : undefined,
        doc.photo
      )
    );
  }

  async findById(id: string): Promise<SubAdminEntities | null> {
    const doc = await SubAdminModel.findById(id).populate<{ address: AddressDocument }>("address");
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
      doc.major_role,
      doc.dateOfBirth,
      doc.gender,
      doc.documents,
      doc.address
        ? {
            _id: doc.address._id.toString(),
            street: doc.address.street,
            city: doc.address.city,
            state: doc.address.state,
            pincode: doc.address.pincode,
          }
        : undefined,
      doc.photo
    );
  }

 async update(id: string, updates: Partial<SubAdminEntities>): Promise<SubAdminEntities | null> {
  if (updates.password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(updates.password, salt);
  }

  const doc = await SubAdminModel.findByIdAndUpdate(
    id,
    {
      ...updates,
      address: updates.address ? updates.address : undefined,
      documents: updates.documents ?? undefined,
      photo: updates.photo ?? undefined,
    },
    { new: true }
  ).populate<{ address: AddressDocument }>("address");

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
    doc.major_role,
    doc.dateOfBirth,
    doc.gender,
    doc.documents,
    doc.address
      ? {
          _id: doc.address._id.toString(),
          street: doc.address.street,
          city: doc.address.city,
          state: doc.address.state,
          pincode: doc.address.pincode,
        }
      : undefined,
    doc.photo
  );
}
async updatePassword(id: string, hashedPassword: string): Promise<SubAdminEntities | null> {
  const doc = await SubAdminModel.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true }
  );

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
    doc.major_role,
    doc.dateOfBirth,
    doc.gender,
    doc.documents,
    doc.address ? doc.address.toString() : undefined,
    doc.photo
  );
}

}
