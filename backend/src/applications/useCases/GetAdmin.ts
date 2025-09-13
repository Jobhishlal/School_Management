import { IAdminRepository } from "../repositories/AdminRepository";
import { AdminResponseDTO } from "../../domain/dto/Admin";

export class GetAdmin{
    constructor(private adminRepo : IAdminRepository){}
    async execute():Promise<AdminResponseDTO[]>{
        const admin = await this.adminRepo.getAll();
       
        return admin.map(a=>({
            id:a.id!,
            username:a.username,
            email:a.email
        }))
    }
}