import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { IMessage } from "../../../infrastructure/database/mongoDB/models/MessageModel";

export interface IEditMessageUseCase {
    execute(messageId: string, userId: string, newContent: string): Promise<IMessage>;
}

export class EditMessageUseCase implements IEditMessageUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(messageId: string, userId: string, newContent: string): Promise<IMessage> {
        const message = await this.chatRepo.findMessageById(messageId);

        if (!message) {
            throw new Error("Message not found");
        }

        if (message.senderId.toString() !== userId) {
            throw new Error("Unauthorized: You can only edit your own messages");
        }

        const timeDiff = (Date.now() - new Date(message.timestamp).getTime()) / 1000 / 60; 

        if (timeDiff > 5) {
            throw new Error("Edit time limit exceeded (5 minutes)");
        }

        const updatedMessage = await this.chatRepo.updateMessage(messageId, newContent);
        if (!updatedMessage) {
            throw new Error("Failed to update message");
        }

        return updatedMessage;
    }
}
