export interface IMarkMessagesReadUseCase {
    execute(senderId: string, receiverId: string): Promise<void>;
}
