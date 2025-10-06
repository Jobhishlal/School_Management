import { Institute } from "../entities/Institute";
export interface IIInstituteProfileUpdate{
    execute(id:string,udpate:Partial<Institute>):Promise<Institute | null >
}