import { SubAdminEntities } from "../entities/SubAdmin";


export interface IAdminBlock {
  execute(id: string, blocked: boolean): Promise<SubAdminEntities>;
}
