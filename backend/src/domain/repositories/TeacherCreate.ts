import { Teeacher } from "../entities/Teacher";

export interface ITeacherCreate{
    create(teacher:Teeacher):Promise<Teeacher>;
    findByEmail(email:string):Promise<Teeacher | null>;
    findByPhone(phone:string):Promise<Teeacher | null >;
    finByAll():Promise<Teeacher[]>;
    update(id:string,update:Partial<Teeacher>):Promise<Teeacher|null>;
    findById(id:string):Promise<Teeacher|null>
}