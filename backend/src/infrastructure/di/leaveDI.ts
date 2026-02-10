import { LeaveManagementController } from "../../presentation/http/controllers/LeaveManagement/LeaveManageController";
import { LeaveManagementMongoRepo } from "../repositories/LeaveManagement/MongoLeaveManagement";
import { CreateLeaveUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/LeaveCreateUseCase";
import { GetTeacherLeavesUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/GetTeacherLeavesUseCase";
import { GetAllLeavesUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/GetAllLeavesUseCase";
import { UpdateLeaveStatusUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/UpdateLeaveStatusUseCase";
import { MongoTeacher } from "../repositories/MongoTeacherRepo";
import { MongoInstituteProfileManage } from "../repositories/IMongoInstituteManage";
import { SubAdminLeaveCreateUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/SubAdminLeaveCreateUseCase";
import { GetSubAdminLeavesUseCase } from "../../applications/useCases/LeavemanagementUseCase.ts/GetSubAdminLeavesUseCase";
import { MongoSubAdminRepo } from "../repositories/MongoSubAdminRepo";

// Repositories
const leaveRepo = new LeaveManagementMongoRepo();
const teacherRepo = new MongoTeacher();
const instituteRepo = new MongoInstituteProfileManage();
const subAdminRepo = new MongoSubAdminRepo();

// Use Cases
const createLeaveUseCase = new CreateLeaveUseCase(leaveRepo, teacherRepo);
const getTeacherLeavesUseCase = new GetTeacherLeavesUseCase(leaveRepo);
const getAllLeavesUseCase = new GetAllLeavesUseCase(leaveRepo);
const updateLeaveStatusUseCase = new UpdateLeaveStatusUseCase(leaveRepo, teacherRepo, instituteRepo, subAdminRepo);
const subAdminLeaveCreateUseCase = new SubAdminLeaveCreateUseCase(leaveRepo, subAdminRepo);
const getSubAdminLeavesUseCase = new GetSubAdminLeavesUseCase(leaveRepo);

// Controller
export const leavemanagecontroller = new LeaveManagementController(
    createLeaveUseCase,
    getTeacherLeavesUseCase,
    getAllLeavesUseCase,
    updateLeaveStatusUseCase,
    subAdminLeaveCreateUseCase,
    getSubAdminLeavesUseCase
);
