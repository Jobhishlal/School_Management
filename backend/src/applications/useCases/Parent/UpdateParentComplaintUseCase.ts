import { IParentComplaintsRepositroy } from "../../../domain/repositories/ParentComplaints/IParentComplaints";
import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";
import { IUpdateParentComplaintUseCase } from "./IUpdateParentComplaintUseCase";

export class UpdateParentComplaintUseCase implements IUpdateParentComplaintUseCase {
    constructor(private parentComplaintRepo: IParentComplaintsRepositroy) { }

    async execute(id: string, data: Partial<ParentComplaints>): Promise<ParentComplaints | null> {
        return await this.parentComplaintRepo.update(id, data);
    }
}
