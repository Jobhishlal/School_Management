import {IAdminRepository} from '../../applications/repositories/AdminRepository';
import {Passwordservices} from '../../infrastructure/security/PasswordService';
import {CreateAdminDTO,AdminResponseDTO} from '../../domain/dto/Admin';
import {Admin} from '../../domain/entities/Admin';
import { AdminError } from '../../domain/enums/Adminsinguperror';
import {verifiedOtptoken} from '../../infrastructure/security/otpJwtService'

export class SignupAdmin{
    constructor(private adminRepo:IAdminRepository){}
    async execute(data:CreateAdminDTO & {otp: string; otpToken: string }):Promise<AdminResponseDTO>{

           const decoded = verifiedOtptoken(data.otpToken)

           if(!decoded || decoded.email!==data.email || decoded.otp!==data.otp ){
             throw new Error(AdminError.Invalid_otp)
           } 

        const exist= await this.adminRepo.findByEmail(data.email);
        if(exist){
            throw new Error(AdminError.Useralreadyexisted);
        
        }
        const usernameexist = await this.adminRepo.findByUserName(data.username)
        if(usernameexist){
            throw new Error(AdminError.UniqueUser_id)
        }

        const hashpassword = await Passwordservices.hashpassword(data.password)
        const admin = new Admin(null,data.username,data.email,hashpassword)
        const save = await this.adminRepo.create(admin)
      
        return {
      id: save.id!,
      username: save.username,
      email: save.email,
    };

    }
   
}
