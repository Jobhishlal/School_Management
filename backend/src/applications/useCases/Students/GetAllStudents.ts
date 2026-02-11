import { Students } from "../../../domain/entities/Students";
import { IGetStudentSInterface } from "../../interface/UseCaseInterface/IStudentGetUseCase";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";


export class StudentList implements IGetStudentSInterface{
    constructor(private readonly IStudnetrepo:StudentDetails){}
    async execute():Promise<Students[]>{
        const students = await this.IStudnetrepo.getAllStudents()
        return students
    }
}
