import { ParentUseCase } from "../../interface/UseCaseInterface/IParentCreate";
import { IParentRepository } from "../../../domain/repositories/IParentsRepository";
import { ParentEntity } from "../../../domain/entities/Parents";
import { ParentValidate } from "../../validators/ParentValidate";

export class ParentAddUseCase implements ParentUseCase {
  constructor(private readonly parentRepo: IParentRepository) {}

  async execute(parent: ParentEntity): Promise<ParentEntity> {


    ParentValidate(parent)

      const email = await this.parentRepo.findByEmail(parent.email || "");
    if(email){
       throw new Error("already existed Email")
    }
    const phone = await this.parentRepo.findByContactNumber(parent.contactNumber||"")
    if(phone){
      throw new Error("already existed Phone Number")
    }
    const created = await this.parentRepo.create(parent);

  
    return created;
  }
}
