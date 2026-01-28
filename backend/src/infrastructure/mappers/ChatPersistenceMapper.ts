import { Message } from "../../domain/entities/Message";
import { Conversation, ConversationParticipant } from "../../domain/entities/Conversation";
import { IMessage } from "../../infrastructure/database/mongoDB/models/MessageModel";
import { IConversation } from "../../infrastructure/database/mongoDB/models/ConversationModel";

export class ChatPersistenceMapper {
    static toDomainMessage(model: IMessage): Message {
        return new Message(
            (model as any)._id.toString(),
            model.senderId.toString(),
            model.senderModel,
            model.receiverId.toString(),
            model.receiverModel,
            model.content,
            model.timestamp,
            model.read,
            model.type,
            model.isEdited,
            model.isDeleted
        );
    }

    static toDomainConversation(model: any): Conversation {
     
        const participants: ConversationParticipant[] = model.participants.map((p: any) => {
 
            const pId = p.participantId._id ? p.participantId._id.toString() : p.participantId.toString();

       
            let details: Partial<ConversationParticipant> = {};
            if (p.participantId._id) {
           
                details = {
                    name: p.participantId.name || p.participantId.fullName,
                    email: p.participantId.email,
                    profileImage: p.participantId.profileImage,
                    role: p.participantId.role
                };
            }

            return {
                participantId: pId,
                participantModel: p.participantModel,
                ...details
            };
        });

        const lastMeasageId = model.lastMessage
            ? (model.lastMessage._id ? model.lastMessage._id.toString() : model.lastMessage.toString())
            : null;

     
        let lastMsgContent = null;
        let lastMsgTime = null;
        if (model.lastMessage && model.lastMessage.content) {
            lastMsgContent = model.lastMessage.content;
            lastMsgTime = model.lastMessage.timestamp;
        }

        return new Conversation(
            model._id.toString(),
            participants,
            lastMeasageId,
            lastMsgContent,
            lastMsgTime,
            model.updatedAt,
            model.isGroup,
            model.groupName,
            model.classId ? model.classId.toString() : undefined,
            model.unreadCount || 0
        );
    }
}
