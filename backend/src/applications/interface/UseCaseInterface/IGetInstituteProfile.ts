import { Institute } from "../../../domain/entities/Institute";

export interface IGetInstituteInterface{
    execute():Promise<Institute[]>
}