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
import { DownLoadInvoice } from "../../applications/useCases/Payment/InvoiceSetUP";


const ParentRouter = Router()

const data = new ParentRepository()
const parentlistfinance = new ParentListTheStudents(data)
const ParentController =  new ParentFinanceList(parentlistfinance)

const peyment = new RazorpayServices()
const peymentrepo = new MongoPeymentRepo()
const createpeyment = new CreateRazorpayOrder(peyment,peymentrepo)
const verfystatus = new VerifyPaymentStatus(peymentrepo)
const verifydataFeeIdbase = new VerifyPaymentByFeeId(peymentrepo)
const invoicedownload = new DownLoadInvoice(peymentrepo)
const peymentcontroller = new PeymentController(createpeyment,verfystatus,verifydataFeeIdbase,invoicedownload)






ParentRouter.post('/parent-finance-list', (req, res) => ParentController.ParentList(req, res));
ParentRouter.post('/create-payment',(req,res)=>peymentcontroller.CreatePayment(req,res))
ParentRouter.put('/update-status/:id',(req,res)=>peymentcontroller.StatusChange(req,res))
ParentRouter.post('/update-status-feeId/:feeId', (req, res) => peymentcontroller.StatusChangeByFeeId(req, res))
ParentRouter.get("/invoice/:paymentId", (req, res) => peymentcontroller.InvoiceDownload(req, res))




export default ParentRouter
