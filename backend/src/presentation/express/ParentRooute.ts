import { Router } from "express";
import { ParentRepository } from "../../infrastructure/repositories/ParentsFeeManagement/ParentsFeePeyment";
import { ParentListTheStudents } from "../../applications/useCases/FeeStructure/ParentListStudent";
import { ParentFinanceList } from "../http/controllers/ParentController.ts/ParentFinanceList";
import { PeymentController } from "../http/controllers/Payment/PaymentController";
import { RazorpayServices } from "../../infrastructure/providers/RazorpayService";
import { CreateRazorpayOrder } from "../../applications/useCases/Payment/CreateRazorpayOrder";
import { MongoPeymentRepo } from "../../infrastructure/repositories/FeeManagement/MongoPeymentManagement";
import { VerifyPaymentStatus } from "../../applications/useCases/Payment/VerifyRazorpayPeyment";
import { VerifyPaymentByFeeId } from "../../applications/useCases/Payment/VerifyStatusupdateFeeId";
import { GetParentPaymentHistory } from "../../applications/useCases/Payment/GetParentPaymentHistory";
import { GetPaymentHistory } from "../../applications/useCases/Payment/GetPaymentHistory";
import { DownLoadInvoice } from "../../applications/useCases/Payment/InvoiceSetUP";
import { ParentAttendanceListController } from "../http/controllers/ParentController.ts/ParentAttendanceListController";
import { ParentAttendanceListUseCase } from "../../applications/useCases/Attendance/AttendanceListParentUseCase";
import { AttendanceMongoRepository } from "../../infrastructure/repositories/Attendance/AttendanceMongoRepo";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { AuthRequest } from "../../infrastructure/types/AuthRequest";
import { ParentDateBaseAttendanceSearch } from "../../applications/useCases/Attendance/ParentAttendanceDateBase";
import { GetParentProfileUseCase } from "../../applications/useCases/Parent/GetParentProfileUseCase";
import { ParentProfileRepository } from "../../infrastructure/repositories/ParentProfileMongo/ParentProfileMongo";
import { ParentManagementCOntroller } from "../http/controllers/ParentController.ts/ParentController"
import { ParentProfileController } from "../http/controllers/ParentController.ts/ParentProfileController";
import { MongoStudentLeaveRepository } from "../../infrastructure/repositories/StudentLeave/MongoStudentLeaveRepository";
import { ApplyStudentLeaveUseCase } from "../../applications/useCases/StudentLeave/ApplyStudentLeaveUseCase";
import { GetStudentLeaveHistoryUseCase } from "../../applications/useCases/StudentLeave/GetStudentLeaveHistoryUseCase";
import { GetClassStudentLeavesUseCase } from "../../applications/useCases/StudentLeave/GetClassStudentLeavesUseCase";
import { ProcessStudentLeaveUseCase } from "../../applications/useCases/StudentLeave/ProcessStudentLeaveUseCase";
import { StudentLeaveController } from "../http/controllers/StudentLeave/StudentLeaveController";
import { MongoParentSignUp } from "../../infrastructure/repositories/MongoSignupParents";
import { ParentComplaintController } from "../http/controllers/ParentController.ts/ParentComplaintController";
import { CreateParentComplaintUseCase } from "../../applications/useCases/Parent/CreateParentComplaintUseCase";
import { MongoParentComplaints } from "../../infrastructure/repositories/ParentComplaint/ParentComplaintmongo";
import { GetParentComplaintsUseCase } from "../../applications/useCases/Parent/GetParentComplaintsUseCase";
import { UpdateParentComplaintUseCase } from "../../applications/useCases/Parent/UpdateParentComplaintUseCase";


const ParentRouter = Router()

const data = new ParentRepository()
const parentlistfinance = new ParentListTheStudents(data)
const ParentController = new ParentFinanceList(parentlistfinance)

const peyment = new RazorpayServices()
const peymentrepo = new MongoPeymentRepo()
const createpeyment = new CreateRazorpayOrder(peyment, peymentrepo)
const verfystatus = new VerifyPaymentStatus(peymentrepo)
const verifydataFeeIdbase = new VerifyPaymentByFeeId(peymentrepo)
const invoicedownload = new DownLoadInvoice(peymentrepo)
const getpaymenthistory = new GetPaymentHistory(peymentrepo)
const getparentpaymenthistory = new GetParentPaymentHistory(peymentrepo)
const peymentcontroller = new PeymentController(createpeyment, verfystatus, verifydataFeeIdbase, invoicedownload, getpaymenthistory, getparentpaymenthistory)



const attendancerepo = new AttendanceMongoRepository()
const Attandanceusecase = new ParentAttendanceListUseCase(attendancerepo)
const parentDatebasefetchattendance = new ParentDateBaseAttendanceSearch(attendancerepo)
const attendanceparentcontroller = new ParentAttendanceListController(Attandanceusecase, parentDatebasefetchattendance)

const perantprofile = new ParentProfileRepository()
const parentprofileusecase = new GetParentProfileUseCase(perantprofile)
const parentprofilercontroller = new ParentProfileController(parentprofileusecase)

// Student Leave Dependencies
const studentLeaveRepo = new MongoStudentLeaveRepository();
const parentAuthRepo = new MongoParentSignUp(); // Implement IParentRepositorySign
const applyLeaveUC = new ApplyStudentLeaveUseCase(studentLeaveRepo);
const getHistoryUC = new GetStudentLeaveHistoryUseCase(studentLeaveRepo);
const getClassLeavesUC = new GetClassStudentLeavesUseCase(studentLeaveRepo);
const processLeaveUC = new ProcessStudentLeaveUseCase(studentLeaveRepo, parentAuthRepo);
const studentLeaveController = new StudentLeaveController(applyLeaveUC, getHistoryUC, getClassLeavesUC, processLeaveUC);

// Parent Complaint Dependencies
const parentComplaintRepo = new MongoParentComplaints();
const createParentComplaintUseCase = new CreateParentComplaintUseCase(parentComplaintRepo);
const getParentComplaintsUseCase = new GetParentComplaintsUseCase(parentComplaintRepo);
const updateParentComplaintUseCase = new UpdateParentComplaintUseCase(parentComplaintRepo);
const parentComplaintController = new ParentComplaintController(createParentComplaintUseCase, getParentComplaintsUseCase, updateParentComplaintUseCase);



ParentRouter.post('/parent-finance-list', (req, res) => ParentController.ParentList(req, res));
ParentRouter.post('/create-payment', (req, res) => peymentcontroller.CreatePayment(req, res))
ParentRouter.put('/update-status/:id', (req, res) => peymentcontroller.StatusChange(req, res))
ParentRouter.post('/update-status-feeId/:feeId', (req, res) => peymentcontroller.StatusChangeByFeeId(req, res))
ParentRouter.get("/invoice/:paymentId", (req, res) => peymentcontroller.InvoiceDownload(req, res))
ParentRouter.get("/payment-history/:studentId", (req, res) => peymentcontroller.GetParentPaymentHistory(req, res))



ParentRouter.get("/parent/attendance/today",
    authMiddleware,
    (req, res) => attendanceparentcontroller.ParentAttendanceList(req as AuthRequest, res)
)


ParentRouter.get('/attendance/filter',
    authMiddleware,
    (req, res) => attendanceparentcontroller.ParentDateBaseFindAttendance(req as AuthRequest, res)
)


ParentRouter.get("/profile/:id",
    (req, res) => {
        parentprofilercontroller.ParentProfile(req, res)
    }

)

// Student Leave Routes
ParentRouter.post("/leave/apply",
    authMiddleware,
    (req, res) => studentLeaveController.applyLeave(req as AuthRequest, res)
)

ParentRouter.get("/leave/student/:studentId",
    authMiddleware,
    (req, res) => studentLeaveController.getStudentLeaves(req, res)
)

// Parent Complaint Routes
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


export default ParentRouter
