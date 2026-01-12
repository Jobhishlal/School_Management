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

import { MongoInstituteProfileManage } from "../../infrastructure/repositories/IMongoInstituteManage";

import { GetSubAdminLeavesUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/GetSubAdminLeavesUseCase";
import { SubAdminLeaveCreateUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/SubAdminLeaveCreateUseCase";

import { MongoSubAdminRepo } from "../../infrastructure/repositories/MongoSubAdminRepo";

const Leaverouter = Router()


const leaverepo = new LeaveManagementMongoRepo()
const teacherRepo = new MongoTeacher();
const instituterepo = new MongoInstituteProfileManage();
const subAdminRepo = new MongoSubAdminRepo();

const createleave = new CreateLeaveUseCase(leaverepo, teacherRepo)
const getTeacherLeaves = new GetTeacherLeavesUseCase(leaverepo);
const getAllLeaves = new GetAllLeavesUseCase(leaverepo);
const updateLeaveStatus = new UpdateLeaveStatusUseCase(leaverepo, teacherRepo, instituterepo, subAdminRepo);
const subAdminLeaveCreate = new SubAdminLeaveCreateUseCase(leaverepo, subAdminRepo);
const getSubAdminLeaves = new GetSubAdminLeavesUseCase(leaverepo);

const leavemanagecontroller = new LeaveManagementController(
    createleave,
    getTeacherLeaves,
    getAllLeaves,
    updateLeaveStatus,
    subAdminLeaveCreate,
    getSubAdminLeaves
);


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


