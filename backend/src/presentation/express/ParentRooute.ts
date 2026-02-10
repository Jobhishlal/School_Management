import { Router } from "express";
import {
    parentFinanceController,
    parentPaymentController,
    parentAttendanceController,
    parentProfileController,
    parentStudentLeaveController,
    parentComplaintController,
    parentDashboardController
} from "../../infrastructure/di/parentDI";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { AuthRequest } from "../../infrastructure/types/AuthRequest";

const ParentRouter = Router()

ParentRouter.post('/parent-finance-list', (req, res) => parentFinanceController.ParentList(req, res));
ParentRouter.post('/create-payment', (req, res) => parentPaymentController.CreatePayment(req, res))
ParentRouter.put('/update-status/:id', (req, res) => parentPaymentController.StatusChange(req, res))
ParentRouter.post('/update-status-feeId/:feeId', (req, res) => parentPaymentController.StatusChangeByFeeId(req, res))
ParentRouter.get("/invoice/:paymentId", (req, res) => parentPaymentController.InvoiceDownload(req, res))
ParentRouter.get("/payment-history/:studentId", (req, res) => parentPaymentController.GetParentPaymentHistory(req, res))



ParentRouter.get("/parent/attendance/today",
    authMiddleware,
    (req, res) => parentAttendanceController.ParentAttendanceList(req as AuthRequest, res)
)


ParentRouter.get('/attendance/filter',
    authMiddleware,
    (req, res) => parentAttendanceController.ParentDateBaseFindAttendance(req as AuthRequest, res)
)


ParentRouter.get("/profile/:id",
    (req, res) => {
        parentProfileController.ParentProfile(req, res)
    }

)

// Student Leave Routes
ParentRouter.post("/leave/apply",
    authMiddleware,
    (req, res) => parentStudentLeaveController.applyLeave(req as AuthRequest, res)
)

ParentRouter.get("/leave/student/:studentId",
    authMiddleware,
    (req, res) => parentStudentLeaveController.getStudentLeaves(req, res)
)


ParentRouter.post("/complaint/create",
    authMiddleware,
    (req, res) => parentComplaintController.createComplaint(req, res)
)

ParentRouter.get("/complaints/my",
    authMiddleware,
    (req, res) => parentComplaintController.getComplaints(req, res)
)

ParentRouter.put("/complaint/update/:id",
    authMiddleware,
    (req, res) => parentComplaintController.updateComplaint(req, res)
)

ParentRouter.get("/dashboard/stats",
    authMiddleware,
    (req, res) => parentDashboardController.getDashboardStats(req, res)
);

export default ParentRouter
