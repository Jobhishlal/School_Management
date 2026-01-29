
export interface IUnifiedLoginUseCase {
    execute(email?: string, password?: string, studentId?: string): Promise<
        | { otpToken: string; role: "super_admin" | "sub_admin" | "Teacher" }
        | { authToken: string; refreshToken: string; role: "Students" | "Parent" }
    >;
}
