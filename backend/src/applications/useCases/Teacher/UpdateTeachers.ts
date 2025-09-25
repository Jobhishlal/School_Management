import { Teeacher } from "../../../domain/entities/Teacher";
import {ITeacherCreate} from '../../../domain/repositories/TeacherCreate';

export class UpdateTeacher{
    constructor(private teacherupdateres : ITeacherCreate){}
    async execute(id:string,update:Partial<{
        name:string,
        email:string,
        phone:string,
        gender:string,
        subjects:[],
        department: "LP" | "UP" | "HS"; 

      

    }>):Promise<Teeacher>{
        if(update.email){
            const exist = await this.teacherupdateres.findByEmail(update.email)
              if (exist && exist.id.toString() !== id.toString()) {
              throw new Error("email already existed");
             }
        }
        if (update.phone) {
         const existingPhone = await this.teacherupdateres.findByPhone(update.phone);


       if (existingPhone && existingPhone.id.toString() !== id.toString()) {
         throw new Error("phone number already existed");
       }
         }

         const updatesteacher = await this.teacherupdateres.update(id,update)
         if(!updatesteacher){
            throw new Error("it does not existed")
         }
         return updatesteacher;
    }
}