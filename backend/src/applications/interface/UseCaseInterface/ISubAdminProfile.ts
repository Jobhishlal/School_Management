import { SubAdminEntities } from "../entities/SubAdmin";

export interface ISubAdminProfileGetUseCase {
  execute(id: string): Promise<SubAdminEntities | null>;
}

