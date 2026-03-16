import { SubAdminEntities } from "../../../domain/entities/SubAdmin";
import { AdminRole } from "../../../domain/enums/AdminRole";



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