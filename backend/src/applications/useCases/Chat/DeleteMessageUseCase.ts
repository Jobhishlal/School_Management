import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { Message } from "../../../domain/entities/Message";
import { IChatSocketService } from "../../../infrastructure/services/IChatSocketService";
import { IDeleteMessageUseCase } from "../../../domain/interfaces/useCases/Chat/IDeleteMessageUseCase";

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
    constructor(
        private chatRepo: IChatRepository,
        private chatSocketService: IChatSocketService
    ) { }

    async execute(messageId: string, userId: string): Promise<Message> {
        console.log(`[DeleteMessageUseCase] Executing delete for messageId: ${messageId} by userId: ${userId}`);
        const message = await this.chatRepo.findMessageById(messageId);

        if (!message) {
            throw new Error("Message not found");
        }

        if (message.senderId.toString() !== userId) {
            throw new Error("Unauthorized: You can only delete your own messages");
        }

        const timeDiff = Date.now() - new Date(message.timestamp).getTime();
        if (timeDiff > 5 * 60 * 1000) {
            throw new Error("Cannot delete message older than 5 minutes");
        }

        const deletedMessage = await this.chatRepo.markMessageAsDeleted(messageId);
        if (!deletedMessage) {
            throw new Error("Failed to delete message");
        }

        let participants: string[] = [];
        if (deletedMessage.receiverModel === 'Conversation') {
            const conversation = await this.chatRepo.findConversationById(deletedMessage.receiverId.toString());
            if (conversation && conversation.participants) {
                participants = conversation.participants.map(p => p.participantId);
            }
        }

        this.chatSocketService.emitMessageDeleteWithSender(
            deletedMessage.senderId.toString(),
            deletedMessage.receiverId.toString(),
            messageId,
            deletedMessage.receiverModel === 'Conversation',
            participants
        );

        return deletedMessage;
    }
}
