import mongoose, { Document, Schema, Types } from "mongoose";

interface Period {
  startTime: string;     
  endTime: string;        
  subject: string;
  teacherId: Types.ObjectId; 
}

interface DaySchedule {
  day: string;            
  periods: Period[];
}

export interface TimetableDocument extends Document {
  classId: Types.ObjectId;
  division: string;
  days: DaySchedule[];
  createdAt: Date;
  updatedAt: Date;
}

const PeriodSchema = new Schema<Period>(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  },
  { _id: false }
);

const DayScheduleSchema = new Schema<DaySchedule>(
  {
    day: { type: String, required: true },
    periods: { type: [PeriodSchema], default: [] },
  },
  { _id: false }
);

const TimetableSchema = new Schema<TimetableDocument>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    division: { type: String, required: true },
    days: { type: [DayScheduleSchema], default: [] },
  },
  { timestamps: true }
);

export const TimetableModel = mongoose.model<TimetableDocument>(
  "Timetable",
  TimetableSchema
);
