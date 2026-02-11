
export interface IRefreshTokenUseCase {
    execute(token: string): Promise<{
        authToken: string;
        role: any;
        id: any;
        email: any;
    }>;
}
