import { MongoParentComplaints } from "../repositories/ParentComplaint/ParentComplaintmongo";
import { GetAllParentComplaintsUseCase } from "../../applications/useCases/Parent/GetAllParentComplaintsUseCase";
import { ResolveComplaintUseCase } from "../../applications/useCases/Parent/ResolveComplaintUseCase";
import { AdminComplaintController } from "../../presentation/http/controllers/ADMIN/AdminComplaintController";

// Repository
const parentComplaintRepo = new MongoParentComplaints();

// Use Cases
const getAllParentComplaintsUseCase = new GetAllParentComplaintsUseCase(parentComplaintRepo);
const resolveComplaintUseCase = new ResolveComplaintUseCase(parentComplaintRepo);

// Controller
export const adminComplaintController = new AdminComplaintController(
    getAllParentComplaintsUseCase,
    resolveComplaintUseCase
);
