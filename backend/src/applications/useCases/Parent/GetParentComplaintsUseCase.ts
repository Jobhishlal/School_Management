import { IParentComplaintsRepositroy } from "../../../domain/repositories/ParentComplaints/IParentComplaints";
import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";
import { IGetParentComplaintsUseCase } from "./IGetParentComplaintsUseCase";

export class GetParentComplaintsUseCase implements IGetParentComplaintsUseCase {
    constructor(private parentComplaintRepo: IParentComplaintsRepositroy) { }

    async execute(parentId: string): Promise<ParentComplaints[]> {
        return await this.parentComplaintRepo.findByParentId(parentId);
    }
}
