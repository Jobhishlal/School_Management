import { ObjectId } from "mongoose";

export interface Meeting {
    _id?: ObjectId | string;
    title: string;
    description?: string;
    link: string;
    type: 'staff' | 'parent' | 'class' | 'PTA' | 'pta';
    classId?: string | ObjectId; 
    className?: string;
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
