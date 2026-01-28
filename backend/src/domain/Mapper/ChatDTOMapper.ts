import { Message } from "../entities/Message";
import { Conversation } from "../entities/Conversation";
import { MessageResponseDTO, ConversationResponseDTO } from "../../applications/dto/ChatDTOs";

export class ChatDTOMapper {
    static toMessageDTO(message: Message): MessageResponseDTO {
        return {
            id: message.id,
            senderId: message.senderId,
            senderRole: message.senderRole,
            receiverId: message.receiverId,
            receiverModel: message.receiverModel,
            content: message.content,
            timestamp: message.timestamp,
            read: message.read,
            type: message.type,
            isEdited: message.isEdited,
            isDeleted: message.isDeleted
        };
    }

    static toConversationDTO(conversation: Conversation): ConversationResponseDTO {
        return {
            id: conversation.id,
            participants: conversation.participants.map(p => ({
                participantId: p.participantId,
                participantModel: p.participantModel,
                name: p.name,
                email: p.email,
                profileImage: p.profileImage,
                role: p.role
            })),
            lastMessage: conversation.lastMessageContent ? {
                content: conversation.lastMessageContent,
                timestamp: conversation.lastMessageTimestamp || conversation.updatedAt
            } : undefined,
            updatedAt: conversation.updatedAt,
            isGroup: conversation.isGroup,
            groupName: conversation.groupName,
            unreadCount: conversation.unreadCount
        };
    }
}
