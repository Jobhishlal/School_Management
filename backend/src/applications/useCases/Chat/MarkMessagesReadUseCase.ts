import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";

export interface IMarkMessagesReadUseCase {
    execute(senderId: string, receiverId: string): Promise<void>;
}

export class MarkMessagesReadUseCase implements IMarkMessagesReadUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(senderId: string, receiverId: string): Promise<void> {
        await this.chatRepo.markMessagesAsRead(senderId, receiverId);
    }
}
