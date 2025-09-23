
import { ParentEntity } from "../entities/Parents";

export interface IParentRepository {
  getAll(): Promise<ParentEntity[]>; 
  create(data: ParentEntity): Promise<ParentEntity>;
  getById(id: string): Promise<ParentEntity | null>;
    findByEmail(email: string): Promise<ParentEntity | null>;
  findByContactNumber(contact: string): Promise<ParentEntity | null>;
}
