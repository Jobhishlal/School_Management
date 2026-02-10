import { ParentRepository } from "../repositories/ParentsFeeManagement/ParentsFeePeyment";
import { ParentListTheStudents } from "../../applications/useCases/FeeStructure/ParentListStudent";
import { ParentFinanceList } from "../../presentation/http/controllers/ParentController.ts/ParentFinanceList";
import { PeymentController } from "../../presentation/http/controllers/Payment/PaymentController";
import { RazorpayServices } from "../providers/RazorpayService";
import { CreateRazorpayOrder } from "../../applications/useCases/Payment/CreateRazorpayOrder";
import { MongoPeymentRepo } from "../repositories/FeeManagement/MongoPeymentManagement";
import { VerifyPaymentStatus } from "../../applications/useCases/Payment/VerifyRazorpayPeyment";
import { VerifyPaymentByFeeId } from "../../applications/useCases/Payment/VerifyStatusupdateFeeId";
import { GetParentPaymentHistory } from "../../applications/useCases/Payment/GetParentPaymentHistory";
import { GetPaymentHistory } from "../../applications/useCases/Payment/GetPaymentHistory";
import { DownLoadInvoice } from "../../applications/useCases/Payment/InvoiceSetUP";
import { ParentAttendanceListController } from "../../presentation/http/controllers/ParentController.ts/ParentAttendanceListController";
import { ParentAttendanceListUseCase } from "../../applications/useCases/Attendance/AttendanceListParentUseCase";
import { AttendanceMongoRepository } from "../repositories/Attendance/AttendanceMongoRepo";
import { ParentDateBaseAttendanceSearch } from "../../applications/useCases/Attendance/ParentAttendanceDateBase";
import { GetParentProfileUseCase } from "../../applications/useCases/Parent/GetParentProfileUseCase";
import { ParentProfileRepository } from "../repositories/ParentProfileMongo/ParentProfileMongo";
import { ParentProfileController } from "../../presentation/http/controllers/ParentController.ts/ParentProfileController";
import { MongoStudentLeaveRepository } from "../repositories/StudentLeave/MongoStudentLeaveRepository";
import { ApplyStudentLeaveUseCase } from "../../applications/useCases/StudentLeave/ApplyStudentLeaveUseCase";
import { GetStudentLeaveHistoryUseCase } from "../../applications/useCases/StudentLeave/GetStudentLeaveHistoryUseCase";
import { GetClassStudentLeavesUseCase } from "../../applications/useCases/StudentLeave/GetClassStudentLeavesUseCase";
import { ProcessStudentLeaveUseCase } from "../../applications/useCases/StudentLeave/ProcessStudentLeaveUseCase";
import { StudentLeaveController } from "../../presentation/http/controllers/StudentLeave/StudentLeaveController";
import { MongoParentSignUp } from "../repositories/MongoSignupParents";
import { ParentComplaintController } from "../../presentation/http/controllers/ParentController.ts/ParentComplaintController";
import { CreateParentComplaintUseCase } from "../../applications/useCases/Parent/CreateParentComplaintUseCase";
import { MongoParentComplaints } from "../repositories/ParentComplaint/ParentComplaintmongo";
import { GetParentComplaintsUseCase } from "../../applications/useCases/Parent/GetParentComplaintsUseCase";
import { UpdateParentComplaintUseCase } from "../../applications/useCases/Parent/UpdateParentComplaintUseCase";
import { SocketNotification } from "../socket/SocketNotification";
import { ParentManagementCOntroller } from "../../presentation/http/controllers/ParentController.ts/ParentController"
import { ParentAddUseCase } from "../../applications/useCases/Parent/ParentUseCase";
import { GetAllParentsUseCase } from "../../applications/useCases/Parent/GetAllParents";
import { UpdateParentUseCase } from "../../applications/useCases/Parent/UpdateParents";
import { ParentMongoRepository } from "../repositories/ParentRepository";
import { GetParentDashboardStatsUseCase } from "../../applications/useCases/Parent/GetParentDashboardStatsUseCase";
import { ParentDashboardController } from "../../presentation/http/controllers/ParentController.ts/ParentDashboardController";
import { MongoStudentRepo } from "../repositories/MongoStudentRepo";
import { ExamMarkMongoRepository } from "../repositories/ExamRepo/ExamMarkMongoRepo";

// Repositories
const adminParentRepo = new ParentMongoRepository();
const parentRepo = new ParentRepository();
const peymentRepo = new MongoPeymentRepo();
const attendanceRepo = new AttendanceMongoRepository();
const parentProfileRepo = new ParentProfileRepository();
const studentLeaveRepo = new MongoStudentLeaveRepository();
const parentAuthRepo = new MongoParentSignUp();
const parentComplaintRepo = new MongoParentComplaints();
const studentRepo = new MongoStudentRepo();
const examRepo = new ExamMarkMongoRepository();

// Services
const razorpayService = new RazorpayServices();
const socketNotification = new SocketNotification();

// Use Cases - Management (Admin)
const createParentUseCase = new ParentAddUseCase(adminParentRepo);
const getAllParentsUseCase = new GetAllParentsUseCase(adminParentRepo);
const updateParentUseCase = new UpdateParentUseCase(adminParentRepo);

// Use Cases - Finance & Payment
const parentListTheStudents = new ParentListTheStudents(parentRepo);
const createRazorpayOrder = new CreateRazorpayOrder(razorpayService, peymentRepo);
const verifyPaymentStatus = new VerifyPaymentStatus(peymentRepo, socketNotification);
const verifyPaymentByFeeId = new VerifyPaymentByFeeId(peymentRepo);
const downloadInvoice = new DownLoadInvoice(peymentRepo);
const getPaymentHistory = new GetPaymentHistory(peymentRepo);
const getParentPaymentHistory = new GetParentPaymentHistory(peymentRepo);

// Use Cases - Attendance
const attendanceListUseCase = new ParentAttendanceListUseCase(attendanceRepo);
const parentDateBaseAttendanceSearch = new ParentDateBaseAttendanceSearch(attendanceRepo);

// Use Cases - Profile
const getParentProfileUseCase = new GetParentProfileUseCase(parentProfileRepo);

// Use Cases - Student Leave
const applyStudentLeaveUseCase = new ApplyStudentLeaveUseCase(studentLeaveRepo);
const getStudentLeaveHistoryUseCase = new GetStudentLeaveHistoryUseCase(studentLeaveRepo);
const getClassStudentLeavesUseCase = new GetClassStudentLeavesUseCase(studentLeaveRepo);
const processStudentLeaveUseCase = new ProcessStudentLeaveUseCase(studentLeaveRepo, parentAuthRepo);

// Use Cases - Complaints
const createParentComplaintUseCase = new CreateParentComplaintUseCase(parentComplaintRepo);
const getParentComplaintsUseCase = new GetParentComplaintsUseCase(parentComplaintRepo);
const updateParentComplaintUseCase = new UpdateParentComplaintUseCase(parentComplaintRepo);

// Use Cases - Dashboard
const getParentDashboardStatsUseCase = new GetParentDashboardStatsUseCase(
    studentRepo,
    attendanceRepo,
    examRepo,
    parentAuthRepo
);

// Controllers
export const parentManagementController = new ParentManagementCOntroller(
    createParentUseCase,
    getAllParentsUseCase,
    updateParentUseCase,
    getParentProfileUseCase
);
export const parentFinanceController = new ParentFinanceList(parentListTheStudents);
export const parentPaymentController = new PeymentController(
    createRazorpayOrder,
    verifyPaymentStatus,
    verifyPaymentByFeeId,
    downloadInvoice,
    getPaymentHistory,
    getParentPaymentHistory
);
export const parentAttendanceController = new ParentAttendanceListController(
    attendanceListUseCase,
    parentDateBaseAttendanceSearch
);
export const parentProfileController = new ParentProfileController(getParentProfileUseCase);
export const parentStudentLeaveController = new StudentLeaveController(
    applyStudentLeaveUseCase,
    getStudentLeaveHistoryUseCase,
    getClassStudentLeavesUseCase,
    processStudentLeaveUseCase
);
export const parentComplaintController = new ParentComplaintController(
    createParentComplaintUseCase,
    getParentComplaintsUseCase,
    updateParentComplaintUseCase
);
export const parentDashboardController = new ParentDashboardController(getParentDashboardStatsUseCase);
