import { Students } from "../entities/Students";

export interface IGetStudentSInterface{
    execute():Promise<Students[]>
}