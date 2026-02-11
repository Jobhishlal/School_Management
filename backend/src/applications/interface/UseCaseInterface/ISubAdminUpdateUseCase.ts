import { SubAdminEntities } from "../../../domain/entities/SubAdmin";
export interface ISubAdminProfileUpdateUseCase {
  execute(id: string, updates: Partial<SubAdminEntities>): Promise<SubAdminEntities | null>;
}
