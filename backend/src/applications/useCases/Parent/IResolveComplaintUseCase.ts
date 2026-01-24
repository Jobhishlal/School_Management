import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";

export interface IResolveComplaintUseCase {
    execute(id: string, feedback: string): Promise<ParentComplaints | null>;
}
