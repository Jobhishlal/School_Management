import { IParentComplaintsRepositroy } from "../../interface/RepositoryInterface/ParentComplaints/IParentComplaints";
import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";
import { IResolveComplaintUseCase } from "./IResolveComplaintUseCase";

export class ResolveComplaintUseCase implements IResolveComplaintUseCase {
    constructor(private parentComplaintRepo: IParentComplaintsRepositroy) { }

    async execute(id: string, feedback: string): Promise<ParentComplaints | null> {
        return await this.parentComplaintRepo.update(id, {
            adminFeedback: feedback,
            ticketStatus: 'solved'
        });
    }
}
