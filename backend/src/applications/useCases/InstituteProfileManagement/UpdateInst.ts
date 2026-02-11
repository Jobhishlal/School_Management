import { Institute } from "../../../domain/entities/Institute";
import { IIInstituteProfileUpdate } from "../../interface/UseCaseInterface/IInstProfileUpdateUseCase";
import { IInstituterepo } from '../../interface/RepositoryInterface/SchoolProfile.ts/IInstituteRepo'

export class UpdateInstituteProfile implements IIInstituteProfileUpdate {
  constructor(private instituterepo: IInstituterepo) { }

  async execute(id: string, update: Partial<Institute>): Promise<Institute | null> {
    const updatedInstitute = await this.instituterepo.updateInsti(id, update);

    if (!updatedInstitute) {
      return null;
    }

    return updatedInstitute;
  }
}
