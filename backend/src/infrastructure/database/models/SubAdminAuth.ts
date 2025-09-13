import mongoose,{Document,Types,Schema} from "mongoose";


export interface ISubAdminAuth extends Document{
    Object_id:Types.ObjectId,
    password:String
}


const AdminAuthSchema = new Schema<ISubAdminAuth>(
    {
        Object_id:{type:Schema.Types.ObjectId,ref:"SubAdmin",required:true},
        password:{type:String,required:true}
    },
    {timestamps:true}
)


export const AdminAuthModel = mongoose.model<ISubAdminAuth>("AdminAuthModel",AdminAuthSchema)