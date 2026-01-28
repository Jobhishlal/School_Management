import { Teeacher } from "../entities/Teacher";

export interface ITeacherCreate {
    create(teacher: Teeacher): Promise<Teeacher>;
    findByEmail(email: string): Promise<Teeacher | null>;
    findByPhone(phone: string): Promise<Teeacher | null>;
    findAll(): Promise<Teeacher[]>;
    update(id: string, update: Partial<Teeacher>): Promise<Teeacher | null>;
    findById(id: string): Promise<Teeacher | null>;
    addDocument(id: string, document: { url: string; filename: string }): Promise<Teeacher | null>;
    addSubjects(id: string, subjects: { name: string; code: string }[]): Promise<Teeacher | null>;
    search(query: string): Promise<Teeacher[]>;
}