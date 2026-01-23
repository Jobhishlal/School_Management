import { IParentComplaintsRepositroy } from "../../../domain/repositories/ParentComplaints/IParentComplaints";
import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";
import { ParentComplaintsSchema } from "../../database/models/Parents/Complaints";
import { CreateParentComplaintsDTO } from "../../../applications/dto/Parentcomplaints/CreateParentComplaints";
import { Types } from "mongoose";


export class MongoParentComplaints implements IParentComplaintsRepositroy {

    async create(data: CreateParentComplaintsDTO): Promise<ParentComplaints> {

        const complaints = await ParentComplaintsSchema.create({
            parentId: new Types.ObjectId(data.parentId),
            concernTitle: data.concernTitle,
            description: data.description
        });


        return new ParentComplaints(
            complaints.parentId.toString(),
            complaints.concernTitle,
            complaints.description,
            complaints.concernDate,
            complaints.ticketStatus as any,
            complaints.id
        );

    }

    async findByParentId(parentId: string, page: number, limit: number): Promise<{ complaints: ParentComplaints[], total: number }> {
        const skip = (page - 1) * limit;

        const total = await ParentComplaintsSchema.countDocuments({ parentId: new Types.ObjectId(parentId) });

        const complaints = await ParentComplaintsSchema.find({ parentId: new Types.ObjectId(parentId) })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const mappedComplaints = complaints.map(c => new ParentComplaints(
            c.parentId.toString(),
            c.concernTitle,
            c.description,
            c.concernDate,
            c.ticketStatus as any,
            c.id
        ));

        return { complaints: mappedComplaints, total };
    }

    async update(id: string, data: Partial<ParentComplaints>): Promise<ParentComplaints | null> {
        const updated = await ParentComplaintsSchema.findByIdAndUpdate(
            id,
            {
                concernTitle: data.concernTitle,
                description: data.description,
                // Add other fields if needed, but usually title and description are editable by parent
            },
            { new: true }
        );

        if (!updated) return null;

        return new ParentComplaints(
            updated.parentId.toString(),
            updated.concernTitle,
            updated.description,
            updated.concernDate,
            updated.ticketStatus as any,
            updated.id
        );
    }
}
