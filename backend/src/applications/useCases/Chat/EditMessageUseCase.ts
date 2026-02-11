import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { Message } from "../../../domain/entities/Message";
import { IChatSocketService } from "../../../infrastructure/services/IChatSocketService";
import { IEditMessageUseCase } from "../../interface/UseCaseInterface/Chat/IEditMessageUseCase";
export class EditMessageUseCase implements IEditMessageUseCase {
    constructor(
        private chatRepo: IChatRepository,
        private chatSocketService: IChatSocketService
    ) { }

    async execute(messageId: string, userId: string, newContent: string): Promise<Message> {
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

        let participants: string[] = [];
        if (updatedMessage.receiverModel === 'Conversation') {
            const conversation = await this.chatRepo.findConversationById(updatedMessage.receiverId.toString());
            if (conversation && conversation.participants) {
                participants = conversation.participants.map(p => p.participantId);
            }
        }

        this.chatSocketService.emitMessageUpdate(
            updatedMessage.receiverId.toString(),
            updatedMessage,
            updatedMessage.receiverModel === 'Conversation',
            participants
        );

        return updatedMessage;
    }
}
