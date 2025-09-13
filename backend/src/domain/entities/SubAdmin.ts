import { AdminRole } from "./AdminRole";

export class SubAdminEntities{
    constructor(
        public readonly id:string,
        public name:string,
        public email:string,
        public phone:string,
        public role:AdminRole,
        public password:string,
        public createdAt:Date,
        public updatedAt:Date,
        public blocked:Boolean=false,
    ){}
    changeRole(newRole:AdminRole){
    if(!Object.values(AdminRole).includes(newRole)){
        throw new Error("Its not valid")
    }
    this.role = newRole
}
}


