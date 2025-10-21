

import { IAssignmentGetstudent } from "../../../domain/UseCaseInterface/Assignment/IGetAssignmentStudent";
import { AssignmentEntity } from "../../../domain/entities/Assignment";
import { IAssignmentRepository } from "../../../domain/repositories/Assignment/IAssignmentRepository ";
import { AssignmentDTO } from "../../dto/AssignmentDTO ";



export class StudentGetAssignment implements IAssignmentGetstudent{
    constructor(private readonly mongorepo:IAssignmentRepository){}

    async execute(studentId: string): Promise<AssignmentEntity[]> {
        const data = await this.mongorepo.getAssignmetEachStudent(studentId)
        if(!data){
            throw new Error("student does not assign assignment ")
        }
        return data
    }
}