import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { Students } from "../../../domain/entities/Students";
import { IStudentUpdateUseCase } from "../../../domain/UseCaseInterface/IStudentupdate";
import {validateStudentUpdate} from '../../validators/StudentValidate'



export class UpdateStudentUseCase implements IStudentUpdateUseCase {
  constructor(private studentRepo: StudentDetails) {}

  async execute(id: string, update: Partial<Students>): Promise<Students | null> {
    validateStudentUpdate(update)
    const updatedStudent = await this.studentRepo.updateAll(id, update);
    

    if (!updatedStudent) {
   
      return null;

    
    }

    return updatedStudent;
  }
}