import { ParentProfileDTO } from "../../../applications/dto/Parent/ParentProfileDTO";

export interface IGetParentProfileUseCase {
    execute(parentId: string): Promise<ParentProfileDTO>;
    
}
