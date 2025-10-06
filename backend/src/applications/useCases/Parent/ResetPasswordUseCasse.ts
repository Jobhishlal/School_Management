
import {IParentRepositorySign} from '../../../domain/repositories/Auth/IParentRepository'
export class ResetParentPasswordUseCase {
  constructor(private parentRepo: IParentRepositorySign) {}

  async execute(email: string, newPassword: string) {
    const updatedParent = await this.parentRepo.updatePassword(email, newPassword);
    if (!updatedParent) throw new Error("Failed to update password");
    return updatedParent;
  }
  }

