import { Router } from "express";
import { leavemanagecontroller } from "../../infrastructure/di/leaveDI";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { AuthRequest } from "../../infrastructure/types/AuthRequest";

const Leaverouter = Router()


Leaverouter.post('/leave/request',
    authMiddleware,
    (req, res) => leavemanagecontroller.LeaveCreate(req as AuthRequest, res)
)

Leaverouter.post('/leave/sub-admin/request',
    authMiddleware,
    (req, res) => leavemanagecontroller.subAdminLeaveCreate(req as AuthRequest, res)
)

Leaverouter.get('/leave/teacher-history',
    authMiddleware,
    (req, res) => leavemanagecontroller.getTeacherLeaves(req as AuthRequest, res)
)

Leaverouter.get('/leave/sub-admin/history',
    authMiddleware,
    (req, res) => leavemanagecontroller.getSubAdminLeaves(req as AuthRequest, res)
)


export default Leaverouter


