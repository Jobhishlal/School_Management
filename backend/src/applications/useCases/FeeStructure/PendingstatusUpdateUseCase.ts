import { Expense } from "../../../domain/entities/FeeType/Expense";
import { UpdatePendingExpenseDTO } from "../../dto/FeeDTO/UpdatePendingExpenseDTO";
import { IUpdatePendingExpense } from "../../../domain/UseCaseInterface/FeeStructure/IUpdatePendingUseCase";
import { IExpenseRepository } from "../../../domain/repositories/FeeDetails/IExpesnseRepositoy";
import { UpdateExpenseReletedValidation } from "../../validators/FeeStructureValidation/ExpenceUpdateReletedvalidaion";


export class PendingStatusUpdateUseCase implements IUpdatePendingExpense{
    constructor(private readonly repo:IExpenseRepository){}

    async execute(dto: UpdatePendingExpenseDTO): Promise<Expense> {
        const update  =  await this.repo.findById(dto.expenseId)
        if(!update){
            throw new Error("expenseid not found")
        }
        if(update.status!=="PENDING"){
            throw new Error("Only Pending status can update")
        }
        UpdateExpenseReletedValidation(dto.data)
        const values = await this.repo.updateIfPending(dto.expenseId,dto.data)

        if(!values){
            throw new Error("does not update new expense")
        }
        return values
    }
}