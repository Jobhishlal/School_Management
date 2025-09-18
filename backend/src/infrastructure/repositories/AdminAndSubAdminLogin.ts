import { ISubadminLogin } from "../../domain/repositories/IAdminRepoLogin";
import { SubAdminModel } from "../database/models/SubAdmin";
import { SubAdminEntities } from "../../domain/entities/SubAdmin";
import { AdminRole } from "../../domain/enums/AdminRole";

export class AdminSubAdminCompaign implements ISubadminLogin {
  async findByEmail(email: string): Promise<SubAdminEntities | null> {
    const admin = await SubAdminModel.findOne({ email });
    if (!admin) return null;

    return new SubAdminEntities(
      admin._id.toString(),
      admin.name,
      admin.email,
      admin.phone,
      admin.role as AdminRole,
      admin.password,
      admin.createdAt,
      admin.updatedAt,
      admin.blocked,
      admin.major_role
    );
  }

  async updateBlockStatus(id: string, blocked: boolean): Promise<void> {
    await SubAdminModel.findByIdAndUpdate(id, { blocked });
  }

  async findByRole(major_role: string): Promise<SubAdminEntities | null> {
    const admin = await SubAdminModel.findOne({ major_role });
    if (!admin) return null;

    return new SubAdminEntities(
      admin._id.toString(),
      admin.name,
      admin.email,
      admin.phone,
      admin.role as AdminRole,
      admin.password,
      admin.createdAt,
      admin.updatedAt,
      admin.blocked,
      admin.major_role
    );
  }
}

