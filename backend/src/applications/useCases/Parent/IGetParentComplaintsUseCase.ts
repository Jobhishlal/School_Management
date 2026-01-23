import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";

export interface IGetParentComplaintsUseCase {
    execute(parentId: string): Promise<ParentComplaints[]>;
}
