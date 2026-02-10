import { Router } from "express";
import { adminComplaintController } from "../../infrastructure/di/complaintDI";

const adminComplaintRouter = Router();

adminComplaintRouter.get('/all-complaints', (req, res) => adminComplaintController.getAllComplaints(req, res));
adminComplaintRouter.patch('/:id/resolve', (req, res) => adminComplaintController.resolveComplaint(req, res));

export default adminComplaintRouter;
