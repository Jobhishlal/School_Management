import { getIO } from "../socket/socket";
import { IChatSocketService } from "../../domain/interfaces/services/IChatSocketService";
import { Message } from "../../domain/entities/Message";

export class ChatSocketService implements IChatSocketService {

    emitMessageToUser(userId: string, event: string, data: any): void {
        try {
            const io = getIO();
            io.to(userId).emit(event, data);
        } catch (error) {
            console.error(`Failed to emit event ${event} to user ${userId}:`, error);
        }
    }

    emitMessageToParticipants(participantIds: string[], event: string, data: any): void {
        try {
            const io = getIO();
            participantIds.forEach(pId => {
                io.to(pId).emit(event, data);
            });
        } catch (error) {
            console.error(`Failed to emit event ${event} to participants:`, error);
        }
    }

    emitNewMessage(receiverId: string, message: Message, isGroup: boolean, participantIds?: string[]): void {
        if (isGroup && participantIds) {
            this.emitMessageToParticipants(participantIds, 'receive_private_message', message);
            this.emitMessageToParticipants(participantIds, 'receive_message', message);
        } else {
            // Check if senderId is string or ObjectId (Entity stores string)
            const senderId = message.senderId;

            this.emitMessageToUser(receiverId, 'receive_message', message);
            this.emitMessageToUser(receiverId, 'receive_private_message', message);

            this.emitMessageToUser(senderId, 'receive_private_message', message);
        }
    }

    emitMessageUpdate(receiverId: string, message: Message, isGroup: boolean, participantIds?: string[]): void {
        if (isGroup && participantIds) {
            this.emitMessageToParticipants(participantIds, 'message_updated', message);
        } else {
            const senderId = message.senderId;

            this.emitMessageToUser(receiverId, 'message_updated', message);
            this.emitMessageToUser(senderId, 'message_updated', message);
        }
    }

    emitMessageDelete(receiverId: string, messageId: string, isGroup: boolean, participantIds?: string[]): void {
        const payload = { messageId, isDeleted: true };
        if (isGroup && participantIds) {
            this.emitMessageToParticipants(participantIds, 'message_deleted', payload);
        } else {

        }
    }

    emitMessageDeleteWithSender(senderId: string, receiverId: string, messageId: string, isGroup: boolean, participantIds?: string[]): void {
        const payload = { messageId, isDeleted: true };
        if (isGroup && participantIds) {
            this.emitMessageToParticipants(participantIds, 'message_deleted', payload);
        } else {
            this.emitMessageToUser(receiverId, 'message_deleted', payload);
            this.emitMessageToUser(senderId, 'message_deleted', payload);
        }
    }

    emitMessagesRead(readerId: string, otherUserId: string): void {
        this.emitMessageToUser(otherUserId, 'messages_read', { readerId });
    }
}
