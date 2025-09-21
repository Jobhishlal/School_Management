
import { ParentEntity } from "../entities/Parents";

export interface IParentRepository {
  getAll(): Promise<ParentEntity[]>; 
  create(data: ParentEntity): Promise<ParentEntity>;
}
