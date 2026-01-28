import { Message } from "../../entities/Message";

export interface IChatSocketService {
    emitMessageToUser(userId: string, event: string, data: any): void;
    emitMessageToParticipants(participantIds: string[], event: string, data: any): void;
    emitNewMessage(receiverId: string, message: Message, isGroup: boolean, participantIds?: string[]): void;
    emitMessageUpdate(receiverId: string, message: Message, isGroup: boolean, participantIds?: string[]): void;
    emitMessageDeleteWithSender(senderId: string, receiverId: string, messageId: string, isGroup: boolean, participantIds?: string[]): void;
    emitMessagesRead(readerId: string, otherUserId: string): void;
}
