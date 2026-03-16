import { Students } from "../../../../domain/entities/Students"

export interface IStudentProfileUseCase{
    execute(StudentId:string):Promise<Students|null>
}