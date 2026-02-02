export interface IDeleteChatSessionUseCase {
    execute(sessionId: string): Promise<void>;
}
