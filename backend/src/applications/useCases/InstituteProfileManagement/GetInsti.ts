import { Institute } from "../../../domain/entities/Institute";
import { IGetInstituteInterface } from "../../../domain/UseCaseInterface/IGetInstituteProfile";
import { IInstituterepo } from "../../../domain/repositories/SchoolProfile.ts/IInstituteRepo";


export class InstituteGetUseCase implements IGetInstituteInterface{
    constructor(private readonly getAll:IInstituterepo){}
    async execute(): Promise<Institute[]> {
        const institute = await this.getAll.getAll()
        return institute
    }
}