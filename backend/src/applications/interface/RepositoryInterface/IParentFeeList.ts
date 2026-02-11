import { ParentEntity } from "../../../domain/entities/Parents";

export interface IParentFeeInterface{
   findByEmail(email: string): Promise<ParentEntity | null>;
   findByEmailAndStudentId(email: string, studentId: string): Promise<ParentEntity | null>;
}