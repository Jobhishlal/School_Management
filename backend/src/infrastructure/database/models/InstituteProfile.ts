import mongoose ,{Document,Schema,Types} from "mongoose";


export interface Photo{
    url:string;
    filename:string;
    uploadedAt:Date;

}

export interface InstituteProfileInterface extends Document {
  _id: string;
  instituteName: string;
  contactInformation: string;
  email: string;
  phone: string;
  address: Types.ObjectId;
  principalName: string;
  logo: Photo[];
}


const PhotoSchema = new Schema<Photo>({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});


const InstituteProfileSchema = new Schema<InstituteProfileInterface>({
  instituteName: { type: String, required: true },
  contactInformation: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: Schema.Types.ObjectId, ref: "Addresses", required: true },
  principalName: { type: String, required: true },
  logo: { type: [PhotoSchema], default: [] },
}, { timestamps: true });
export const InstituteModel = mongoose.model<InstituteProfileInterface>("Institute",InstituteProfileSchema)