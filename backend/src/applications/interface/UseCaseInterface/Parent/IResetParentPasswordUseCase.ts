import { ParentSignUpEntity } from "../../../../domain/entities/ParentSignupEntity";

export interface IResetParentPasswordUseCase {
    execute(email: string, newPassword: string): Promise<ParentSignUpEntity>;
}
