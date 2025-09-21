import { Students } from "../entities/Students";

export interface StudentDetails{
    create(student:Students):Promise<Students>;
    findByStudentId(studentId:string):Promise<Students | null >
}