import { ParentEntity } from "../entities/Parents";

export interface ParentUseCase{
    execute(Parent:ParentEntity):Promise<ParentEntity>
    
}