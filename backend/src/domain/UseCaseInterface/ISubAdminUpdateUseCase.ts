import { SubAdminEntities } from "../entities/SubAdmin";
export interface ISubAdminProfileUpdateUseCase {
  execute(id: string, updates: Partial<SubAdminEntities>): Promise<SubAdminEntities | null>;
}
