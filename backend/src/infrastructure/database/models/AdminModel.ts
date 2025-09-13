import mongoose ,{Schema,Document,Types} from "mongoose";

export interface AdminDoc extends Document{
   _id: Types.ObjectId;
  username:string;
  email:string;
  password?:string;
  profile?:string;
  provider:'local'|'google';
  googleId:string;
}

const AdminSchema = new Schema({
  username:{type:String,required:true},
  email:{type:String,unique:true,required:true},
  password:{type:String},
  picture:{type:String},
  provider:{type:String,enum:["local","google"]},
  googleId:{type:String}
})

export const AdminModel=mongoose.model<AdminDoc>("Admin",AdminSchema)