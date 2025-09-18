import { Teeacher } from "../../../domain/entities/Teacher";
import {ITeacherCreate} from '../../../domain/repositories/TeacherCreate'

export class BlockTeacher{
    constructor(private teacherblock:ITeacherCreate){}
    async execute(id:string,blocked:boolean):Promise<Teeacher>{
        const teacher = await this.teacherblock.findById(id)

        if(!teacher){
            throw new Error("Teacher Not Found")
        }

         const update = await this.teacherblock.update(id,{blocked});
         if(!update){
            throw new Error("User Does Not Exist")
         }

         return update
    }
}