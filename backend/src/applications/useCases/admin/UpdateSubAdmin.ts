import { AdminRole } from "../../../domain/enums/AdminRole";
import { SubAdminEntities } from "../../../domain/entities/SubAdmin";
import { SubAdminRepository } from "../../interface/RepositoryInterface/SubAdminCreate";
import { IUpdateadmin } from "../../interface/UseCaseInterface/IAdminUpdate";

export class UpdateDetails implements IUpdateadmin {
  constructor(private subadminrepo: SubAdminRepository) {}

  async execute(
      id: string,
      updates: Partial<{
      name: string;
      email: string;
      phone: string;
      role: AdminRole;
      dateOfBirth: Date;
      gender: "Male" | "Female" | "Other";
      documents: { url: string; filename: string; uploadedAt: Date }[];
      photo: { url: string; filename: string; uploadedAt: Date }[];
      addressId: string;
    }>
  ): Promise<SubAdminEntities> {

   
    if (updates.email) {
      const existingEmail = await this.subadminrepo.findByEmail(updates.email);
      if (existingEmail && existingEmail.id.toString() !== id.toString()) {
        throw new Error("Email already exists");
      }
    }

   
    if (updates.phone) {
      const existingPhone = await this.subadminrepo.findByPhone(updates.phone);
      if (existingPhone && existingPhone.id.toString() !== id.toString()) {
        throw new Error("Phone number already exists");
      }
    }

   
    const update = await this.subadminrepo.update(id, updates);
    if (!update) {
      throw new Error("SubAdmin not found");
    }

    return update;
  }
}
