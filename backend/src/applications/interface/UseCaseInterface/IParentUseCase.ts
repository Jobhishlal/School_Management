import { ParentEntity } from "../../../domain/entities/Parents";

export interface Iupdatparentusecase{
    execute(id:string,udpate:Partial<ParentEntity>):Promise<ParentEntity | null>
}