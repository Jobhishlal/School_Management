import { ParentProfileDTO } from "../../../dto/Parent/ParentProfileDTO";

export interface IGetParentProfileUseCase {
    execute(parentId: string): Promise<ParentProfileDTO>;
}
