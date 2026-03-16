import { ParentSignUpEntity } from "../../../domain/entities/ParentSignupEntity";

export interface IParentSignupUseCase {
  execute(id?: string, studentId?: string, email?: string,password?: string,
  ): Promise<ParentSignUpEntity>;
}
