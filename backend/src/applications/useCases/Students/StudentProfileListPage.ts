import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { Students } from "../../../domain/entities/Students";
import { IStudentProfileUseCase } from "../../interface/UseCaseInterface/StudentCreate/IStudentProfile";


export class StudentProfilePageview implements IStudentProfileUseCase{
    constructor(private readonly studentrepo:StudentDetails){}

    async execute(StudentId: string): Promise<Students | null> {
        return await this.studentrepo.findStudentById(StudentId)
    }


 }