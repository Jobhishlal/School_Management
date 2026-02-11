import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";
import { IDeleteClassUseCase } from "../../interface/UseCaseInterface/ClassBase/IDeleteClassorDivisionUseCase";
export class DeleteClassUseCase implements IDeleteClassUseCase{
    constructor(private readonly classRepo: IClassRepository) { }




    async execute(id: string): Promise<boolean> {
        if(!id){
            throw new Error("Class Id is required")
        }
        return await this.classRepo.deleteClass(id)
    }
}
