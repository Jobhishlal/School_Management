import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";

export function validateComplaintCreate(data: any): void {
    ParentComplaints.validate(data);
}
