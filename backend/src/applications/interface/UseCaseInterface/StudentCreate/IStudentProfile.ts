import { Students } from "../../entities/Students"

export interface IStudentProfileUseCase{
    execute(StudentId:string):Promise<Students|null>
}