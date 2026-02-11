import { SubAdminEntities } from "../entities/SubAdmin";
import { AdminRole } from "../enums/AdminRole";



export interface ICreateAdmin{
    execute(input:{
        name:string,
        email:string,
        phone:string,
        role:AdminRole,
        blocked:boolean,
        major_role:string
    }):Promise<SubAdminEntities>
}