import { Router } from "express";
import { LeaveManagementController } from "../http/controllers/LeaveManagement/LeaveManageController";
import { LeaveManagementMongoRepo } from "../../infrastructure/repositories/LeaveManagement/MongoLeaveManagement";
import { CreateLeaveUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/LeaveCreateUseCase";
import { GetTeacherLeavesUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/GetTeacherLeavesUseCase";
import { GetAllLeavesUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/GetAllLeavesUseCase";
import { UpdateLeaveStatusUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/UpdateLeaveStatusUseCase";
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { AuthRequest } from "../../infrastructure/types/AuthRequest";

const Leaverouter = Router()


const leaverepo = new LeaveManagementMongoRepo()
const teacherRepo = new MongoTeacher();

const createleave = new CreateLeaveUseCase(leaverepo)
const getTeacherLeaves = new GetTeacherLeavesUseCase(leaverepo);
const getAllLeaves = new GetAllLeavesUseCase(leaverepo);
const updateLeaveStatus = new UpdateLeaveStatusUseCase(leaverepo, teacherRepo);

const leavemanagecontroller = new LeaveManagementController(
    createleave,
    getTeacherLeaves,
    getAllLeaves,
    updateLeaveStatus
);


Leaverouter.post('/leave/request',
    authMiddleware,
    (req, res) => leavemanagecontroller.LeaveCreate(req as AuthRequest, res)
)

Leaverouter.get('/leave/teacher-history',
    authMiddleware,
    (req, res) => leavemanagecontroller.getTeacherLeaves(req as AuthRequest, res)
)

// Routes moved to AdminRoutes.ts

export default Leaverouter


