import { ParentEntity } from "../../../domain/entities/Parents";

export interface ParentUseCase{
    execute(Parent:ParentEntity):Promise<ParentEntity>
    
}