import { Institute } from "../../entities/Institute";

export interface IInstituterepo{
    getAll():Promise<Institute[]>
    createAll(data:Institute):Promise<Institute>
    updateInsti(id:string,udpate:Partial<Institute>):Promise<Institute | null >
}