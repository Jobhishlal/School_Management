import { IUpdateSubAdminPasswordUseCase } from "../../interface/UseCaseInterface/IUpdateSubAdminPasswordUseCase";
import { SubAdminRepository } from "../../../domain/repositories/SubAdminCreate";
import { SubAdminEntities } from "../../../domain/entities/SubAdmin";
import {ValidateSubAdminPassword } from '../../validators/PasswordValidation'
import bcrypt from "bcryptjs";
export class UpdateSubAdminPasswordUseCase implements IUpdateSubAdminPasswordUseCase {
  constructor(private subAdminRepo: SubAdminRepository) {}

 async execute(id: string, newPassword: string): Promise<SubAdminEntities | null> {
     ValidateSubAdminPassword(newPassword);
  const user = await this.subAdminRepo.findById(id);
  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await this.subAdminRepo.updatePassword(user._id, hashedPassword);
}

}
