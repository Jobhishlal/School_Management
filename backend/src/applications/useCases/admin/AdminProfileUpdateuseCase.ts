import { SubAdminRepository } from "../../interface/RepositoryInterface/SubAdminCreate";
import { SubAdminEntities } from "../../../domain/entities/SubAdmin";
import { ISubAdminProfileUpdateUseCase} from '../../../applications/interface/UseCaseInterface/ISubAdminUpdateUseCase'
import bcrypt from "bcryptjs";
import {SubAdminErrorMessageValidate} from '../../validators/SubAdminValidation'

export class SubAdminProfileUpdateUseCase implements ISubAdminProfileUpdateUseCase {
  constructor(private subAdminRepo: SubAdminRepository) {}

  async execute(id: string, updates: Partial<SubAdminEntities>): Promise<SubAdminEntities | null> {
    SubAdminErrorMessageValidate(updates as SubAdminEntities, true);
    const allowedUpdates: Partial<SubAdminEntities> = {
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
      dateOfBirth: updates.dateOfBirth,
      gender: updates.gender,
      photo: updates.photo,
      address: updates.address,
      documents: updates.documents,
    };

  
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      allowedUpdates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedProfile = await this.subAdminRepo.update(id, allowedUpdates);
    return updatedProfile;
  }
}
