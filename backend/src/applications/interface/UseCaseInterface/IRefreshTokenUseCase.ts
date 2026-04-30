
export interface IRefreshTokenUseCase {
    execute(token: string): Promise<{
        authToken: string;
        role: ReturnType<typeof JSON.parse>;
        id: ReturnType<typeof JSON.parse>;
        email: ReturnType<typeof JSON.parse>;
    }>;
}
