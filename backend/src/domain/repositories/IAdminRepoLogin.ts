import { SubAdminEntities } from "../entities/SubAdmin";

export interface ISubadminLogin{
    findByEmail(email:string):Promise<SubAdminEntities|null>;
    updateBlockStatus(id:string,blocked:boolean):Promise<void>;
    findByRole(major_role:string):Promise<SubAdminEntities|null>;
}