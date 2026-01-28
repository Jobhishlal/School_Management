import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { IMessage } from "../../../infrastructure/database/mongoDB/models/MessageModel";

export interface IDeleteMessageUseCase {
    execute(messageId: string, userId: string): Promise<IMessage>;
}

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(messageId: string, userId: string): Promise<IMessage> {
        const message = await this.chatRepo.findMessageById(messageId);

        if (!message) {
            throw new Error("Message not found");
        }

        if (message.senderId.toString() !== userId) {
            throw new Error("Unauthorized: You can only delete your own messages");
        }

        const deletedMessage = await this.chatRepo.markMessageAsDeleted(messageId);
        if (!deletedMessage) {
            throw new Error("Failed to delete message");
        }

        return deletedMessage;
    }
}
