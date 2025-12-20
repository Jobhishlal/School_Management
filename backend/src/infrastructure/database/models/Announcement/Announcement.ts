
import mongoose ,{Document,Schema} from "mongoose";


export interface attachment{
  url:string,
  filename:string,
  uploadAt:Date
}

export interface IAnnouncement extends Document{
    title:string,
    content:string,
    scope:'GLOBAL'|'CLASS'|'DIVISION',
    classes:string[],
    division:string,
    attachment?: attachment[];
    activeTime:Date|string,
    endTime:Date|string,
    status:'DRAFT'|'ACTIVE'
}

const attachmentschema = new Schema<attachment>({
  url:{type:String,required:false},
  filename:{type:String,required:true},
  uploadAt:{type:Date}
})


const Announcement = new Schema<IAnnouncement>({
    title:{type:String,},
    content:{type:String},
    scope:{type:String,enum:['GLOBAL','CLASS','DIVISION']},
    classes: {type: [String], 
    default: [],
  },

    division:{type:String},
    attachment: { type:[attachmentschema],default:[] },
    activeTime:{type:Date||String},
    endTime:{type:Date||String},
    status:{type:String,   enum: ["DRAFT", "ACTIVE"],    default: "DRAFT", }
}, { timestamps: true


 })

export const AnnouncementModel = mongoose.model<IAnnouncement>("Announcement",Announcement)

Announcement.index({ scope: 1 });
Announcement.index({ activeTime: 1, endTime: 1 });
Announcement.index({ status: 1 });
