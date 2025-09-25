import { IAdminRepository } from "../../../domain/repositories/AdminRepository";
import { AdminResponseDTO } from "../../dto/Admin";
import { IGetAdmin } from "../../../domain/UseCaseInterface/IGetAdmin";

export class GetAdmin implements IGetAdmin{
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