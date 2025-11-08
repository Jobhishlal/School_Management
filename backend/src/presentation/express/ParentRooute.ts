import { Router } from "express";
import { ParentRepository } from "../../infrastructure/repositories/ParentsFeeManagement/ParentsFeePeyment";
import { ParentListTheStudents } from "../../applications/useCases/FeeStructure/ParentListStudent";
import { ParentFinanceList } from "../http/controllers/ParentController.ts/ParentFinanceList";
import { PeymentController } from "../http/controllers/Payment/PaymentController";
import { RazorpayServices } from "../../infrastructure/providers/RazorpayService";
import { CreateRazorpayOrder } from "../../applications/useCases/Payment/CreateRazorpayOrder";


const ParentRouter = Router()

const data = new ParentRepository()
const parentlistfinance = new ParentListTheStudents(data)
const ParentController =  new ParentFinanceList(parentlistfinance)

const peyment = new RazorpayServices()
const createpeyment = new CreateRazorpayOrder(peyment)
const peymentcontroller = new PeymentController(createpeyment)






ParentRouter.post('/parent-finance-list', (req, res) => ParentController.ParentList(req, res));
ParentRouter.post('/create-payment',(req,res)=>peymentcontroller.CreatePayment(req,res))





export default ParentRouter
