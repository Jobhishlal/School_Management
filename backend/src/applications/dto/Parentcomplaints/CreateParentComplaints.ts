import { ObjectId } from "mongoose";

export interface CreateParentComplaintsDTO {
    parentId: string;
    concernTitle: string;
    description: string;
}