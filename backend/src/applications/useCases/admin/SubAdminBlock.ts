import { SubAdminEntities } from "../../../domain/entities/SubAdmin";
import { SubAdminRepository } from "../../../domain/repositories/SubAdminCreate";
import { IAdminBlock } from "../../interface/UseCaseInterface/IBlockSubAdmin";

export class SubAdminBlock implements IAdminBlock{
  constructor(private subadminRepo: SubAdminRepository) {}

  async execute(id: string, blocked: boolean): Promise<SubAdminEntities> {
    const admin = await this.subadminRepo.findById(id);
    if (!admin) {
      throw new Error("SubAdmin not found");
    }

    const updated = await this.subadminRepo.update(id, { blocked });
    if (!updated) {
      throw new Error("Failed to update SubAdmin block status");
    }

    return updated;
  }
}
