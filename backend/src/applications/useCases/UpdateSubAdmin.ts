
import { AdminRole } from "../../domain/enums/AdminRole";
import { SubAdminEntities } from "../../domain/entities/SubAdmin";
import { SubAdminRepository } from "../../domain/repositories/SubAdminCreate";

export class UpdateDetails{
    constructor(private subadminrepo:SubAdminRepository){}
    async execute(id:string,updates:Partial<{
        name:string;
        email:string;
        phone:string;
        role:AdminRole;
    }>):Promise<SubAdminEntities>{


  if (updates.email) {
  const existingEmail = await this.subadminrepo.findByEmail(updates.email);


  if (existingEmail && existingEmail.id.toString() !== id.toString()) {
    throw new Error("email already existed");
  }
}

if (updates.phone) {
  const existingPhone = await this.subadminrepo.findByPhone(updates.phone);


  if (existingPhone && existingPhone.id.toString() !== id.toString()) {
    throw new Error("phone number already existed");
  }
}




    const update = await this.subadminrepo.update(id,updates)
    if(!update){
        throw new Error("SubAdmin Not Found")
    }
    return update
    }
}