import { Router } from "express";
import { AdminComplaintController } from "../http/controllers/ADMIN/AdminComplaintController";
import { MongoParentComplaints } from "../../infrastructure/repositories/ParentComplaint/ParentComplaintmongo";
import { GetAllParentComplaintsUseCase } from "../../applications/useCases/Parent/GetAllParentComplaintsUseCase";
import { ResolveComplaintUseCase } from "../../applications/useCases/Parent/ResolveComplaintUseCase";

const adminComplaintRouter = Router();

const parentComplaintRepo = new MongoParentComplaints();
const getAllParentComplaintsUseCase = new GetAllParentComplaintsUseCase(parentComplaintRepo);
const resolveComplaintUseCase = new ResolveComplaintUseCase(parentComplaintRepo);
const adminComplaintController = new AdminComplaintController(getAllParentComplaintsUseCase, resolveComplaintUseCase);

adminComplaintRouter.get('/all-complaints', (req, res) => adminComplaintController.getAllComplaints(req, res));
adminComplaintRouter.patch('/:id/resolve', (req, res) => adminComplaintController.resolveComplaint(req, res));

export default adminComplaintRouter;
