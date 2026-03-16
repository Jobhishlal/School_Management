import { SubAdminEntities } from "../../../domain/entities/SubAdmin";


export interface IAdminBlock {
  execute(id: string, blocked: boolean): Promise<SubAdminEntities>;
}
