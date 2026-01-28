import { IMessage } from "../../../infrastructure/database/mongoDB/models/MessageModel";
import { Message } from "../../entities/Message";
import { Conversation } from "../../entities/Conversation";

export interface IChatRepository {
    saveMessage(message: Partial<IMessage>): Promise<Message>;
    getMessages(senderId: string, receiverId: string): Promise<Message[]>;
    createOrUpdateConversation(senderId: string, senderModel: string, receiverId: string, receiverModel: string, lastMessageId: string): Promise<void>;
    getConversations(userId: string): Promise<Conversation[]>;
    markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
    createGroupConversation(groupName: string, participantIds: { participantId: string, participantModel: string }[], classId?: string): Promise<any>;
    updateConversationLastMessage(conversationId: string, messageId: string): Promise<void>;
    findConversationById(conversationId: string): Promise<Conversation | null>;
    getGroupMessages(groupId: string): Promise<Message[]>;
    updateMessage(messageId: string, content: string): Promise<Message | null>;
    markMessageAsDeleted(messageId: string): Promise<Message | null>;
    findMessageById(messageId: string): Promise<Message | null>;
}
