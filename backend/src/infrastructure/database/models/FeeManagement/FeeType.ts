import mongoose,{Schema,Document} from "mongoose";


export type Frequancy = "ONCE"|"MONTHLY"|"YEARLY";


export interface OfferInterface{
    type:string;
    discountPercentage?:number;
    discountAmount?:number;
    finalAmount?: number; 
    validUntil?:Date
}


export interface IFeeType extends Document{


    name:string;
    description:string;
    defaultAmount:number;
    frequency:Frequancy;
    isOptional:boolean;
    isActive:boolean;
    Offers:OfferInterface[];
    createdAt:Date,
    updateAt:Date

}

const OfferSchema = new Schema<OfferInterface>({
  type: { type: String, required: true },
  discountPercentage: { type: Number },
  discountAmount: { type: Number },
  finalAmount:{type:Number},
  validUntil: { type: Date },
});


const FeeTypeSchema = new Schema<IFeeType>({
    name:{type:String,required:true,unique:true},
    description:{type:String,default:""},
    defaultAmount: { type: Number, required: true },
    frequency: { type: String, enum: ["ONCE", "MONTHLY", "YEARLY"], default: "YEARLY" },
    isOptional: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    Offers: { type: [OfferSchema], default: [] },
}, { timestamps: true })

export const FeeTypeModel = mongoose.model<IFeeType>("FeeType", FeeTypeSchema);