import { SubAdminEntities } from "../entities/SubAdmin";

export interface IUpdateSubAdminPasswordUseCase {
  execute(email: string, newPassword: string): Promise<SubAdminEntities | null>;
}