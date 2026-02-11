import { IParentComplaintsRepositroy } from "../../interface/RepositoryInterface/ParentComplaints/IParentComplaints";
import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";
import { IGetAllParentComplaintsUseCase } from "./IGetAllParentComplaintsUseCase";

export class GetAllParentComplaintsUseCase implements IGetAllParentComplaintsUseCase {
    constructor(private parentComplaintRepo: IParentComplaintsRepositroy) { }

    async execute(page: number, limit: number): Promise<{ complaints: ParentComplaints[], total: number }> {
        return await this.parentComplaintRepo.findAll(page, limit);
    }
}
