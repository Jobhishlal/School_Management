import { ParentComplaints } from "../../../../domain/entities/ParentComplaints/ParentComplaints";
import { CreateParentComplaintsDTO } from "../../../dto/Parentcomplaints/CreateParentComplaints";

export interface IParentComplaintsRepositroy {
    create(data: CreateParentComplaintsDTO): Promise<ParentComplaints>;
    findByParentId(parentId: string, page: number, limit: number): Promise<{ complaints: ParentComplaints[], total: number }>;
    update(id: string, data: Partial<ParentComplaints>): Promise<ParentComplaints | null>;
    findAll(page: number, limit: number): Promise<{ complaints: ParentComplaints[], total: number }>;
}