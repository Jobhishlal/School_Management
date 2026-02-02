import { CreateParentComplaintsDTO } from "../../dto/Parentcomplaints/CreateParentComplaints";
import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";

export interface ICreateParentComplaintUseCase {
    execute(data: CreateParentComplaintsDTO): Promise<ParentComplaints>;
}


