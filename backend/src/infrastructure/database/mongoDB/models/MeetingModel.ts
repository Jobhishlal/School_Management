import mongoose, { Schema, Document } from 'mongoose';
import { Meeting } from '../../../../domain/entities/Meeting';

export interface IMeetingDocument extends Meeting, Document {
    _id: mongoose.Schema.Types.ObjectId;
}

const MeetingSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String, required: true, unique: true },
    type: { type: String, enum: ['staff', 'parent', 'class', 'PTA', 'pta'], required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Classes', required: function (this: any) { return this.type === 'class'; } },
    className: { type: String },
    createdBy: { type: String, required: true },
    startTime: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
    participants: [{
        userId: { type: String },
        role: { type: String },
        joinedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

export const MeetingModel = mongoose.model<IMeetingDocument>('Meeting', MeetingSchema);
