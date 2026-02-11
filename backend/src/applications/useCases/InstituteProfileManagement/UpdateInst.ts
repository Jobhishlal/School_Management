import { Institute } from "../../../domain/entities/Institute";
import { IIInstituteProfileUpdate } from "../../interface/UseCaseInterface/IInstProfileUpdateUseCase";
import { IInstituterepo } from '../../interface/RepositoryInterface/SchoolProfile.ts/IInstituteRepo'
import { InstituteErrorMessageValidate } from "../../validators/InstitutProfileValidate";

export class UpdateInstituteProfile implements IIInstituteProfileUpdate {
  constructor(private instituterepo: IInstituterepo) {}

  async execute(id: string, update: Partial<Institute>): Promise<Institute | null> {

    try {
    
      const tempInstitute = new Institute(
        id,
        update.instituteName ?? "",
        update.contactInformation ?? "",
        update.email ?? "",
        update.phone ?? "",
        update.address ?? "",
        update.principalName ?? "",
        update.logo ?? []
      );

      InstituteErrorMessageValidate(tempInstitute, true);
    } catch (error: any) {
      throw new Error(error.message); 
    }


    const updatedInstitute = await this.instituterepo.updateInsti(id, update);

    if (!updatedInstitute) {
      return null;
    }

    return updatedInstitute;
  }
}
