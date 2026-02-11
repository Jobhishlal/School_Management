import { ICheckSubAdminDuplicate } from "../../interface/UseCaseInterface/SubAdmin/ICheckSubAdminDuplicate";
import { SubAdminRepository } from "../../interface/RepositoryInterface/SubAdminCreate";

export class SubAdminDuplicate implements ICheckSubAdminDuplicate{
    constructor(private readonly sudadminrepo:SubAdminRepository){}
    async execute(email: string, phone: string): Promise<void> {
        const existed = await this.sudadminrepo.findByEmail(email)
        if(existed){
            throw new Error("This Email Already Existed")
        }
        const existedphone = await  this.sudadminrepo.findByPhone(phone)
        if(existedphone){
            throw new Error("Phone number already existed")
        }
    }
}