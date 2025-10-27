import mongoose,{Schema,Document} from "mongoose";


export type Frequancy = "ONCE"|"MONTHLY"|"YEARLY";


export interface IFeeType extends Document{


    name:string;
    description:string;
    defaultAmount:number;
    frequency:Frequancy;
    isOptional:boolean;
    isActive:boolean;
    createdAt:Date,
    updateAt:Date

}


const FeeTypeSchema = new Schema<IFeeType>({
    name:{type:String,required:true,unique:true},
    description:{type:String,default:""},
    defaultAmount: { type: Number, required: true },
    frequency: { type: String, enum: ["ONCE", "MONTHLY", "YEARLY"], default: "YEARLY" },
    isOptional: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

export const FeeTypeModel = mongoose.model<IFeeType>("FeeType", FeeTypeSchema);