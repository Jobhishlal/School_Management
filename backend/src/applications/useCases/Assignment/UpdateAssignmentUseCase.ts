import { IAssignmentupdate } from "../../../domain/UseCaseInterface/Assignment/IUpdateUseCase";
import { AssignmentEntity } from "../../../domain/entities/Assignment";
import { IAssignmentRepository } from "../../../domain/repositories/Assignment/IAssignmentRepository ";
import { AssignmentDTO } from "../../dto/AssignmentDTO ";
import { ValidateAssignmentUpdate } from "../../validators/Assignment/AssignmentUpdateValidation";


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