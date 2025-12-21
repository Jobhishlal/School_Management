import { Class } from "../../entities/Class";
export interface IClassRepository {
  getAll(): Promise<Class[]>; 
   create(data: Class): Promise<Class>;
  updateClass(id:string,update:Partial<Class>):Promise<Class | null>;
  assignClassWithDivision(className:string):Promise<Class|null>
  findById(id:string):Promise<Class>
  
 
}
