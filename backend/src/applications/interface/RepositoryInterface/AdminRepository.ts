import { AdminResponseDTO } from '../../dto/Admin'
import { Admin } from "../../../domain/entities/Admin";

export interface IAdminRepository {
    create(admin: Admin): Promise<AdminResponseDTO>;
    findByEmail(email: string): Promise<AdminResponseDTO | null>;
    findByUserName(username: string): Promise<AdminResponseDTO | null>;
    getAll(): Promise<AdminResponseDTO[]>
}