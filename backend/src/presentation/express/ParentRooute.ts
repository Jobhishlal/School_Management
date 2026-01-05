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
import { ParentAttendanceListUseCase } from "../../applications/useCases/Attendance/AttendanceListParentUseCase"; 4
import { AttendanceMongoRepository } from "../../infrastructure/repositories/Attendance/AttendanceMongoRepo";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { AuthRequest } from "../../infrastructure/types/AuthRequest";
import { ParentDateBaseAttendanceSearch } from "../../applications/useCases/Attendance/ParentAttendanceDateBase";
import { GetParentProfileUseCase } from "../../applications/useCases/Parent/GetParentProfileUseCase";
import { ParentProfileRepository } from "../../infrastructure/repositories/ParentProfileMongo/ParentProfileMongo";
import { ParentManagementCOntroller } from "../http/controllers/ParentController.ts/ParentController"
import { ParentProfileController } from "../http/controllers/ParentController.ts/ParentProfileController";
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






export default ParentRouter
