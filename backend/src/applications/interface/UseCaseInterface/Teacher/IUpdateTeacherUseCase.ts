import { Teeacher } from "../../../../domain/entities/Teacher";

export interface IUpdateTeacherUseCase {
    execute(id: string, update: Partial<{
        name: string,
        email: string,
        phone: string,
        gender: string,
        subjects: [],
        department: "LP" | "UP" | "HS"; 
    }>): Promise<Teeacher>;
}
