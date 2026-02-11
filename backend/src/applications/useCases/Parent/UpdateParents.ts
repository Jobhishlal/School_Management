import { ParentEntity } from "../../../domain/entities/Parents";
import { IParentRepository } from "../../interface/RepositoryInterface/IParentsRepository";
import { Iupdatparentusecase } from "../../interface/UseCaseInterface/IParentUseCase";
import { validateParentUpdate } from "../../validators/ParentValidate";

export class UpdateParentUseCase implements Iupdatparentusecase{
    constructor(private parentrepo:IParentRepository){}
    async execute(id:string,update:Partial<ParentEntity>):Promise<ParentEntity | null >{
        validateParentUpdate(update)
        const updateparent  = await this.parentrepo.update(id,update)

        if (update.email) {
    const existingEmailParent = await this.parentrepo.findByEmail(update.email); 
   
    if (existingEmailParent && existingEmailParent.id.toString() !== id) {
        throw new Error("Email address is already in use by another parent.");
    }

}

        if(!updateparent){
            return null
        }
        return updateparent
    }
}