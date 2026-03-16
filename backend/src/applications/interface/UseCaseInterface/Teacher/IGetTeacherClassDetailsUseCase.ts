import { ClassDetailsDTO } from "../../../dto/ClassDetailsDTO";

export interface IGetTeacherClassDetailsUseCase {
    execute(teacherId: string, search?: string, page?: number, limit?: number): Promise<ClassDetailsDTO | null>;
}
