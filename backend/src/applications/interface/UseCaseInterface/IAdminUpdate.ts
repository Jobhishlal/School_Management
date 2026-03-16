import { SubAdminEntities } from "../../../domain/entities/SubAdmin";
import { AdminRole } from "../../../domain/enums/AdminRole";

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
