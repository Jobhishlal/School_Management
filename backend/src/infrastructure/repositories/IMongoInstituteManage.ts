import { InstituteModel,InstituteProfileInterface } from "../database/models/InstituteProfile";
import { Institute } from "../../domain/entities/Institute";
import { IInstituterepo } from '../../applications/interface/RepositoryInterface/SchoolProfile.ts/IInstituteRepo'
import mongoose from "mongoose";


export class MongoInstituteProfileManage implements IInstituterepo{
   private toObjectId(id: any) {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    }
    async createAll(data: Institute): Promise<Institute> {
        const InstituteProfile = new InstituteModel(
           {
            instituteName:data.instituteName,
            contactInformation:data.contactInformation,
            email:data.email,
            phone:data.phone,
            address:this.toObjectId(data.address),
            principalName:data.principalName,
            logo:data.logo

           }
           
        )
        const saved = await InstituteProfile.save()
        await saved.populate([
            {path:"address"}
        ])
       
        return this.mapTODomainPopulate(InstituteProfile)
    }
    async getAll(): Promise<Institute[]> {
        const Institute = await InstituteModel.find().populate("address")
        return Institute.map(s=>this.mapTODomainPopulate(s))
    }
    async updateInsti(id: string, udpate: Partial<Institute>): Promise<Institute | null> {
        const Institute = await InstituteModel.findByIdAndUpdate(
            this.toObjectId(id),
            {
                $set:{
                    ...(udpate.instituteName &&{instituteName:udpate.instituteName}),
                    ...(udpate.instituteName&&{contactInformation:udpate.instituteName}),
                    ...(udpate.email&&{email:udpate.email}),
                    ...(udpate.phone&&{phone:udpate.phone}),
                    ...(udpate.address&&{address:this.toObjectId(udpate.address)}),
                    ...(udpate.principalName&&{principalName:udpate.principalName}),
                    ...(udpate.logo&&{logo:udpate.logo})
                }
            },{new:true}
        ).populate("address")
        if(!Institute)return null
        return this.mapTODomainPopulate(Institute)
    }
    
    private mapTODomainPopulate(
  institute: InstituteProfileInterface & { address: any }
): Institute {
  return new Institute(
    institute._id.toString(),
    institute.instituteName,
    institute.contactInformation,
    institute.email,
    institute.phone,
    institute.address,
    institute.principalName,
    institute.logo
  );
}


}