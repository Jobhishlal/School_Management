import { ParentStudentFetchDTO } from "../../dto/FeeDTO/ParentStudentFinanceDTO";
import { IParentStudentList } from "../../interface/UseCaseInterface/FeeStructure/IParentStudentList";
import { ParentEntity } from "../../../domain/entities/Parents";
import { IParentFeeInterface } from "../../interface/RepositoryInterface/IParentFeeList";


export class ParentListTheStudents implements IParentStudentList{
    constructor(  private perentrepo:IParentFeeInterface){}
  

     async execute(request: ParentStudentFetchDTO): Promise<ParentEntity | null> {
         const {email,studentId}=request;
         const parentData = await this.perentrepo.findByEmailAndStudentId(email,studentId)
         if(!parentData){
            throw new Error("ParentEmail and studentId missing")
         }
         return parentData
     }
} 