import { Teeacher } from "../../../../domain/entities/Teacher";

export interface IBlockTeacherUseCase {
    execute(id: string, blocked: boolean): Promise<Teeacher>;
}
