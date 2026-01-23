import { ParentComplaints } from "../../entities/ParentComplaints/ParentComplaints";
import { CreateParentComplaintsDTO } from "../../../applications/dto/Parentcomplaints/CreateParentComplaints";

export interface IParentComplaintsRepositroy {
    create(data: CreateParentComplaintsDTO): Promise<ParentComplaints>;
    findByParentId(parentId: string): Promise<ParentComplaints[]>;
    update(id: string, data: Partial<ParentComplaints>): Promise<ParentComplaints | null>;
}