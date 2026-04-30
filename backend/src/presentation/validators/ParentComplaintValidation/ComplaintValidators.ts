import { ParentComplaints } from "../../../domain/entities/ParentComplaints/ParentComplaints";

export function validateComplaintCreate(data: ReturnType<typeof JSON.parse>): void {
    ParentComplaints.validate(data);
}
