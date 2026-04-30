
import { IParentRepositorySign } from "../../interface/RepositoryInterface/Auth/IParentRepository";
import { IResetParentPasswordUseCase } from "../../interface/UseCaseInterface/Parent/IResetParentPasswordUseCase";

export class ResetParentPasswordUseCase implements IResetParentPasswordUseCase {
  constructor(private parentRepo: IParentRepositorySign) {}

  async execute(email: string, newPassword: string) {
    const updatedParent = await this.parentRepo.updatePassword(email, newPassword);
    if (!updatedParent) throw new Error("Failed to update password");
    return updatedParent;
  }
  }

