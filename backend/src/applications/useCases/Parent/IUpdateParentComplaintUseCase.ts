import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";

export interface IUpdateParentComplaintUseCase {
    execute(id: string, data: Partial<ParentComplaints>): Promise<ParentComplaints | null>;
}
