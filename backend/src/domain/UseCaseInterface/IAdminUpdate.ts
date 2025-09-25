import { SubAdminEntities } from "../entities/SubAdmin";
import { AdminRole } from "../enums/AdminRole";

export interface IUpdateadmin {
  execute(
    id: string,
    updates: Partial<{
      name: string;
      email: string;
      phone: string;
      role: AdminRole;
    }>
  ): Promise<SubAdminEntities>;
}
