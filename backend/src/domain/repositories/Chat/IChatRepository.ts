import { IMessage } from "../../../infrastructure/database/mongoDB/models/MessageModel";
import { IConversation } from "../../../infrastructure/database/mongoDB/models/ConversationModel";

export interface IChatRepository {
    saveMessage(message: Partial<IMessage>): Promise<IMessage>;
    getMessages(senderId: string, receiverId: string): Promise<IMessage[]>;
    createOrUpdateConversation(senderId: string, senderModel: string, receiverId: string, receiverModel: string, lastMessageId: string): Promise<void>;
    getConversations(userId: string): Promise<IConversation[]>;
    markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
    createGroupConversation(groupName: string, participantIds: { participantId: string, participantModel: string }[], classId?: string): Promise<any>;
    updateConversationLastMessage(conversationId: string, messageId: string): Promise<void>;
    findConversationById(conversationId: string): Promise<IConversation | null>;
    getGroupMessages(groupId: string): Promise<IMessage[]>;
    updateMessage(messageId: string, content: string): Promise<IMessage | null>;
    markMessageAsDeleted(messageId: string): Promise<IMessage | null>;
    findMessageById(messageId: string): Promise<IMessage | null>;
}
