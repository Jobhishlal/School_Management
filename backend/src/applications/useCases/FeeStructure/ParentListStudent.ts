import { ParentLoginDTO } from "../../dto/ParentLoginDTO";
import { IParentStudentList } from "../../../domain/UseCaseInterface/FeeStructure/IParentStudentList";
import { ParentEntity } from "../../../domain/entities/Parents";
import { IParentFeeInterface } from "../../../domain/repositories/IParentFeeList";


export class ParentListTheStudents implements IParentStudentList{
    constructor(  private perentrepo:IParentFeeInterface){}
  

     async execute(request: ParentLoginDTO): Promise<ParentEntity | null> {
         const {email,studentId}=request;
         const parentData = await this.perentrepo.findByEmailAndStudentId(email,studentId)
         if(!parentData){
            throw new Error("ParentEmail and studentId missing")
         }
         return parentData
     }
} 