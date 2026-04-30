
export interface IParentAuthRepository {
    findByEmailAndStudentId(email: string, studentId: string): Promise<ReturnType<typeof JSON.parse>>;
}
