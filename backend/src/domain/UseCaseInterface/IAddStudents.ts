import { Students } from "../entities/Students";

export interface IStudentAddUsecase{
    execute(student:Students):Promise<Students>
}