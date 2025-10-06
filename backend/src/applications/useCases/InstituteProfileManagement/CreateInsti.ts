import { Institute } from "../../../domain/entities/Institute";
import { IInstituterepo } from "../../../domain/repositories/SchoolProfile.ts/IInstituteRepo";
import { IInstituteUsecase } from "../../../domain/UseCaseInterface/IInstituteProfileUseCase";


export class CreateInstitute implements IInstituteUsecase{
    constructor(private instituterepo:IInstituterepo){}
    async execute(institute: Institute): Promise<Institute> {
        const createinstitute = await this.instituterepo.createAll(institute)
        return createinstitute
        
    }
}