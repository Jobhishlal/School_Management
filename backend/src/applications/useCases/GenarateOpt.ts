import { IAdminRepository } from "../../domain/repositories/AdminRepository";
import { GenarateOtp } from '../../shared/constants/utils/Otpgenarator';
import { SendEMail } from '../../infrastructure/providers/EmailService';
import { genarateotptoken } from '../../infrastructure/security/otpJwtService';
import { AdminError } from '../../domain/enums/Adminsinguperror';

export class GenarateOtpP {
  constructor(private adminRepo: IAdminRepository) {}

  async execute(username: string, email: string, password: string) {
 
    const exist = await this.adminRepo.findByEmail(email);
    if (exist) throw new Error(AdminError.Useralreadyexisted);

    const useexist = await this.adminRepo.findByUserName(username);
    if (useexist) throw new Error(AdminError.UniqueUser_id);

 
    const otp = GenarateOtp(6);

    await SendEMail(email, "Verify your signup", `Your OTP is ${otp}`);

    
    const otpToken = genarateotptoken(email, otp, { password });

    return { otpToken };
  }
}
