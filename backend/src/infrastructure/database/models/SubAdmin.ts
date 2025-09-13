import mongoose ,{Schema,Document,Types} from "mongoose";

import { AdminRole } from "../../../domain/entities/AdminRole";


export interface SubAdmin extends Document{
_id:Types.ObjectId;
name:string;
email:string;
phone:string;
password:string
role:AdminRole;
createdAt:Date;
updatedAt:Date;
blocked:boolean,

}


const SubAdminSchema = new Schema<SubAdmin>(
    {
        name:{type:String,required:true},
        email:{type:String,required:true},
        phone:{type:String,required:true},
        password:{type:String,required:true},
        role:{type:String,enum:Object.values(AdminRole),required:true},
        blocked:{type:Boolean,default:false}
    },
    {timestamps:true}
)
export const SubAdminModel = mongoose.model<SubAdmin>("SubAdmin",SubAdminSchema)