
export interface IParentAuthRepository {
    findByEmailAndStudentId(email: string, studentId: string): Promise<any>;
}
