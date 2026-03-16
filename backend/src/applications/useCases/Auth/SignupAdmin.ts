import { IAdminRepository } from '../../interface/RepositoryInterface/AdminRepository';
import { Passwordservices } from '../../../infrastructure/security/PasswordService';
import { CreateAdminDTO, AdminResponseDTO } from '../../dto/Admin';
import { Admin } from '../../../domain/entities/Admin';
import { AdminError } from '../../../domain/enums/Adminsinguperror';
import { verifiedOtptoken } from '../../../infrastructure/security/otpJwtService';

export class SignupAdmin {
  constructor(private adminRepo: IAdminRepository) {}

  async execute(data: CreateAdminDTO & { otp: string; otpToken: string }): Promise<AdminResponseDTO> {
    const decoded = verifiedOtptoken(data.otpToken);

    if (!decoded || decoded.email !== data.email || decoded.otp !== data.otp) {
      throw new Error(AdminError.Invalid_otp);
    }

    const exist = await this.adminRepo.findByEmail(data.email);
    if (exist) throw new Error(AdminError.Useralreadyexisted);

    const usernameExist = await this.adminRepo.findByUserName(data.username);
    if (usernameExist) throw new Error(AdminError.UniqueUser_id);

    const hashPassword = await Passwordservices.hashpassword(data.password);

    const adminToSave = new Admin(
      null,
      data.username,
      data.email,
      hashPassword
    );

    const savedAdmin = await this.adminRepo.create(adminToSave);

    return {
      id: savedAdmin.id,
      username: savedAdmin.username,
      email: savedAdmin.email
    };
  }
}
