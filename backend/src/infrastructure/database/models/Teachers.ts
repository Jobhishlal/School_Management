import mongoose,{Document,Schema,Types} from "mongoose";

export interface Teachers extends Document{
_id:Types.ObjectId;
name:string;
email:string;
gender:string;
phone:string;
Password:string;
createdAt:Date;
updatedAt:Date;
role:string;
blocked:boolean;

}


const TeacherSchema = new Schema<Teachers>(
    {
        name:{type:String,required:true},
        email:{type:String,required:true},
        gender:{type:String,required:true},
        phone:{type:String,required:true},
        role:{type:String,default:"Teacher"},
        blocked:{type:Boolean,default:false},
        Password:{type:String},
        
    },
    {timestamps:true}
)

export const TeacherModel = mongoose.model<Teachers>("Teacher",TeacherSchema)