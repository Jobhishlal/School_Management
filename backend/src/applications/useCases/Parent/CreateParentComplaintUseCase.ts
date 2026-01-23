import { IParentComplaintsRepositroy } from "../../../domain/repositories/ParentComplaints/IParentComplaints";
import { CreateParentComplaintsDTO } from "../../dto/Parentcomplaints/CreateParentComplaints";
import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";
import { ICreateParentComplaintUseCase } from "./ICreateParentComplaintUseCase";

export class CreateParentComplaintUseCase implements ICreateParentComplaintUseCase {
    constructor(private parentComplaintRepo: IParentComplaintsRepositroy) { }

    async execute(data: CreateParentComplaintsDTO): Promise<ParentComplaints> {
        return await this.parentComplaintRepo.create(data);
    }
}
