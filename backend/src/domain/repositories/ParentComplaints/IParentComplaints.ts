import { ParentComplaints } from "../../entities/ParentComplaints/ParentComplaints";
import { CreateParentComplaintsDTO } from "../../../applications/dto/Parentcomplaints/CreateParentComplaints";

export interface IParentComplaintsRepositroy {
    create(data: CreateParentComplaintsDTO): Promise<ParentComplaints>;
    findByParentId(parentId: string, page: number, limit: number): Promise<{ complaints: ParentComplaints[], total: number }>;
    update(id: string, data: Partial<ParentComplaints>): Promise<ParentComplaints | null>;
}