import { Class } from "../entities/Class";
export interface IClassRepository {
  getAll(): Promise<Class[]>; 
  create(data: Class): Promise<Class>;
}
