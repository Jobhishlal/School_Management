import { ObjectId } from "mongoose";

export interface Meeting {
    _id?: ObjectId | string;
    title: string;
    description?: string;
    link: string;
    type: 'staff' | 'parent' | 'class';
    classId?: string | ObjectId; // Optional, only for 'class' type
    className?: string; // Optional, for display purposes
    createdBy: string | ObjectId;
    startTime: Date;
    status: 'scheduled' | 'live' | 'ended';
    participants?: {
        userId: string;
        role: string;
        joinedAt: Date;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}
