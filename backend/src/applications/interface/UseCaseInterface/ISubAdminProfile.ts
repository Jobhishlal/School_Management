import { SubAdminEntities } from "../../../domain/entities/SubAdmin";

export interface ISubAdminProfileGetUseCase {
  execute(id: string): Promise<SubAdminEntities | null>;
}

