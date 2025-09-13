import { SubAdminEntities } from "../../domain/entities/SubAdmin";
import { AdminRole } from "../../domain/entities/AdminRole";
import { SubAdminRepository } from "../repositories/SubAdminCreate";
import { genaratePassword } from "../../infrastructure/utils/TempPassGenarator";
import { SendEMail } from "../../infrastructure/providers/EmailService";
import bcrypt from "bcrypt";

export class CreateSubAdmin {
  constructor(private subAdminRepo: SubAdminRepository) {}

  async execute(input: {
    name: string;
    email: string;
    phone: string;
    role: AdminRole;
    blocked:boolean
  }): Promise<SubAdminEntities> { 

      const existemail = await this.subAdminRepo.findByEmail(input.email);
       if (existemail) {
       throw new Error("This email already exists");
       }

      const exist = await this.subAdminRepo.findByPhone(input.phone);
      if (exist) {
      throw new Error("This phone number already exists");
      }

   
    const tempPassword = genaratePassword();


    const hashed = await bcrypt.hash(tempPassword, 10);

    const subAdmin = new SubAdminEntities(
      "",
      input.name,
      input.email,
      input.phone,
      input.role,
      hashed,
      new Date(),
      new Date(),
      input.blocked
    
    );


    const saved = await this.subAdminRepo.create(subAdmin);


    await SendEMail(
      input.email,
      "Your SubAdmin Account Credentials",
     `Hello ${input.name},\n\nYour temporary password is: ${tempPassword}\n\nPlease login and change it immediately.`
     );
   

    return saved;
  }
   async getAll(): Promise<SubAdminEntities[]> {
    return await this.subAdminRepo.findAll();
  }
}
