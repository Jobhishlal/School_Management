import { IAdminRepository } from "../../applications/interface/RepositoryInterface/AdminRepository";
import { Admin } from "../../domain/entities/Admin";
import { AdminModel } from "../database/models/AdminModel";
import { AdminResponseDTO } from '../../applications/dto/Admin';

export class AdminRepository implements IAdminRepository {
    async create(admin: Admin): Promise<AdminResponseDTO> {
        const created = await AdminModel.create({
            username: admin.username,
            email: admin.email,
            password: admin.password
        });

        if (!created._id) throw new Error("ID cannot be null");

        return {
            id: String(created._id),
            username: created.username,
            email: created.email
            
        };
    }

    async findByEmail(email: string): Promise<AdminResponseDTO | null> {
        const doc = await AdminModel.findOne({ email });
        if (!doc) return null;

        return {
            id: String(doc._id),
            username: doc.username,
            email: doc.email
        };
    }

    async findByUserName(username: string): Promise<AdminResponseDTO | null> {
        const doc = await AdminModel.findOne({ username });
        if (!doc) return null;

        return {
            id: String(doc._id),
            username: doc.username,
            email: doc.email
        };
    }

    async getAll(): Promise<AdminResponseDTO[]> {
        const docs = await AdminModel.find();
        return docs.map(doc => ({
            id: String(doc._id),
            username: doc.username,
            email: doc.email
        }));
    }
}
