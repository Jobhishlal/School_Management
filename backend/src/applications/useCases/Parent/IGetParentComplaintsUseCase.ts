import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";

export interface IGetParentComplaintsUseCase {
    execute(parentId: string, page: number, limit: number): Promise<{ complaints: ParentComplaints[], total: number }>;
}
