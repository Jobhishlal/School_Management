import { Institute } from "../entities/Institute"

export interface IGetInstituteInterface{
    execute():Promise<Institute[]>
}