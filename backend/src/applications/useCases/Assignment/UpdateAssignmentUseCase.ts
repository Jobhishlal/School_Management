import { IAssignmentupdate } from "../../interface/UseCaseInterface/Assignment/IUpdateUseCase";
import { IAssignmentRepository } from "../../interface/RepositoryInterface/Assignment/IAssignmentRepository ";
import { ValidateAssignmentUpdate } from "../../validators/Assignment/AssignmentUpdateValidation";
import { AssignmentDTO } from "../../dto/AssignmentDTO ";
import { AssignmentEntity } from "../../../domain/entities/Assignment";


export class UpdateAssignment implements IAssignmentupdate{
     constructor(private readonly Assigmentrepo:IAssignmentRepository){}

     
  async execute(id: string, update: AssignmentDTO): Promise<AssignmentEntity> {
    ValidateAssignmentUpdate(update)
    const data = await this.Assigmentrepo.updateAssignmentDTO(id, update);

    if (!data) {
      throw new Error("Assignment not found or update failed");
    }

    return data;
  }
}