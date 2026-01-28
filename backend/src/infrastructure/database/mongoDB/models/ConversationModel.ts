import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    participants: {
        participantId: mongoose.Schema.Types.ObjectId;
        participantModel: 'Students' | 'Teacher';
    }[];
    lastMessage: mongoose.Schema.Types.ObjectId;
    updatedAt: Date;
    isGroup?: boolean;
    groupName?: string;
    classId?: mongoose.Schema.Types.ObjectId;
}

const ConversationSchema: Schema = new Schema({
    participants: [{
        _id: false,
        participantId: { type: Schema.Types.ObjectId, required: true, refPath: 'participantModel' },
        participantModel: { type: String, required: true, enum: ['Students', 'Teacher'] }
    }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    classId: { type: Schema.Types.ObjectId, ref: 'Classes' }, // Optional, for context
}, { timestamps: true });

// Index for faster lookups of conversations involving a user
ConversationSchema.index({ 'participants.participantId': 1 });

export const ConversationModel = mongoose.model<IConversation>('Conversation', ConversationSchema);

