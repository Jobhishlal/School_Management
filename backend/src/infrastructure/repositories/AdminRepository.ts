import { IAdminRepository } from "../../applications/repositories/AdminRepository";
import { Admin } from "../../domain/entities/Admin";
import { AdminModel } from "../database/models/AdminModel";

export class AdminRepository implements IAdminRepository{
    async create (admin:Admin):Promise<Admin>{
        const created = await AdminModel.create({
            username:admin.username,
            email:admin.email,
            password:admin.password
        })
        return new Admin(String(created._id),created.username,created.email,created.password)
    }
    async findByEmail(email: string): Promise<Admin | null> {
        const doc = await AdminModel.findOne({email});
        if(!doc)return null;
        return new Admin(String(doc._id),doc.username,doc.email,doc.password)
    }

      async findByUserName(username: string): Promise<Admin | null> {
        const doc = await AdminModel.findOne({ username });
        if (!doc) return null;
        return new Admin(String(doc._id), doc.username, doc.email, doc.password);
    }

    async getAll(): Promise<Admin[]> {
        const doc = await AdminModel.find();
        return doc.map(doc=>new Admin(String(doc._id),doc.username,doc.email,doc.password))
    }
}