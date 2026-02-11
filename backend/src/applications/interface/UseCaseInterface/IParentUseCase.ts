import { ParentEntity } from "../entities/Parents";

export interface Iupdatparentusecase{
    execute(id:string,udpate:Partial<ParentEntity>):Promise<ParentEntity | null>
}