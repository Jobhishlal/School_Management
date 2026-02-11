import { SubAdminEntities } from "../../../domain/entities/SubAdmin";
import { AdminRole } from "../../../domain/enums/AdminRole";
import { SubAdminRepository } from "../../interface/RepositoryInterface/SubAdminCreate";
import { ICreateAdmin } from "../../interface/UseCaseInterface/ICreateSubAdmin";
import { ICheckSubAdminDuplicate } from "../../interface/UseCaseInterface/SubAdmin/ICheckSubAdminDuplicate";
import { IPasswordsubadmin } from "../../interface/UseCaseInterface/SubAdmin/IPasswordHash";
import { ISendEmailService } from "../../interface/UseCaseInterface/SubAdmin/ISendEmailService";


export class CreateSubAdmin implements ICreateAdmin {
  constructor(
    private readonly mongorepo:SubAdminRepository,
    private readonly subadminduplicate:ICheckSubAdminDuplicate,
    private readonly passwordcheck:IPasswordsubadmin,
    private readonly emailservice:ISendEmailService

  ){}

 
  async execute(input: { 
  name: string; 
  email: string; 
  phone: string; 
  role: AdminRole; 
  blocked: boolean; 
  major_role: string; 
  dateOfBirth: Date; 
  gender: "Male" | "Female" | "Other"; 
  documents?: { url: string; filename: string; uploadedAt: Date }[];
  photo?: { url: string; filename: string; uploadedAt: Date }[];
  addressId: string;
}): Promise<SubAdminEntities> {


  await this.subadminduplicate.execute(input.email, input.phone);

 
  const { plain: tempPassword, hashed } = await this.passwordcheck.execute();


  const subAdmin = new SubAdminEntities(
    "",
    input.name,
    input.email,
    input.phone,
    input.role,
    hashed,
    new Date(),
    new Date(),
    input.blocked,
    input.major_role,
    input.dateOfBirth,
    input.gender,
    input.documents || [],
    input.addressId,
    input.photo || []
  );

  const savedSubAdmin = await this.mongorepo.create(subAdmin);


  await this.emailservice.execute(
    input.email,
    "Your SubAdmin Account Credentials",
    `Hello ${input.name},\n\nYour temporary password is: ${tempPassword}\n\nPlease login and change it immediately.`
  );


  return savedSubAdmin;
}

async getAll(): Promise<SubAdminEntities[]> { 
  
  return await this.mongorepo.findAll();
 }


}
