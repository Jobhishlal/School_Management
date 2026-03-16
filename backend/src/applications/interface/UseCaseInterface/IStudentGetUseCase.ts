import { Students } from "../../../domain/entities/Students";

export interface IGetStudentSInterface{
    execute():Promise<Students[]>
}