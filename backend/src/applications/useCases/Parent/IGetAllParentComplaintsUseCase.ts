import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";

export interface IGetAllParentComplaintsUseCase {
    execute(page: number, limit: number): Promise<{ complaints: ParentComplaints[], total: number }>;
}
