import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    senderId: mongoose.Schema.Types.ObjectId;
    senderModel: 'Students' | 'Teacher';
    receiverId: mongoose.Schema.Types.ObjectId;
    receiverModel: 'Students' | 'Teacher' | 'Conversation';
    content: string;
    timestamp: Date;
    read: boolean;
    type: 'text' | 'image' | 'file' | 'audio';
    isEdited?: boolean;
    isDeleted?: boolean;
}

const MessageSchema: Schema = new Schema({
    senderId: { type: Schema.Types.ObjectId, required: true, refPath: 'senderModel' },
    senderModel: { type: String, required: true, enum: ['Students', 'Teacher'] },
    receiverId: { type: Schema.Types.ObjectId, required: true, refPath: 'receiverModel' },
    receiverModel: { type: String, required: true, enum: ['Students', 'Teacher', 'Conversation'] },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['text', 'image', 'file', 'audio'], default: 'text' },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
});

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
