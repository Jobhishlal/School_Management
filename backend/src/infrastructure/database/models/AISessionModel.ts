import mongoose, { Schema, Document } from "mongoose";
import { IYouTubeVideo } from "../../../domain/repositories/AI/IYouTubeService";

export interface IAISessionDocument extends Document {
    studentId: string;
    title: string;
    messages: {
        id: string;
        role: 'user' | 'ai';
        content: string;
        videos?: IYouTubeVideo[];
        timestamp: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const AISessionSchema = new Schema({
    studentId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    messages: [{
        id: { type: String, required: true },
        role: { type: String, enum: ['user', 'ai'], required: true },
        content: { type: String, required: true },
        videos: [{
            id: { type: String },
            title: { type: String },
            thumbnail: { type: String },
            url: { type: String }
        }],
        timestamp: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

export const AISessionModel = mongoose.model<IAISessionDocument>("AISession", AISessionSchema);
