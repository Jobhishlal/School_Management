import { Router } from "express";
import { ParentRepository } from "../../infrastructure/repositories/ParentsFeeManagement/ParentsFeePeyment";
import { ParentListTheStudents } from "../../applications/useCases/FeeStructure/ParentListStudent";
import { ParentFinanceList } from "../http/controllers/ParentController.ts/ParentFinanceList";


const ParentRouter = Router()

const data = new ParentRepository()
const parentlistfinance = new ParentListTheStudents(data)
const ParentController =  new ParentFinanceList(parentlistfinance)



ParentRouter.post('/parent-finance-list', (req, res) => ParentController.ParentList(req, res));





export default ParentRouter
