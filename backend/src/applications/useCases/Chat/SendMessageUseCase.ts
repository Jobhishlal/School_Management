import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { Message } from "../../../domain/entities/Message";
import { IChatSocketService } from "../../../infrastructure/services/IChatSocketService";
import { ISendMessageUseCase } from "../../interface/UseCaseInterface/Chat/ISendMessageUseCase";
import { ConversationParticipant } from "../../../domain/entities/Conversation";

export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        private chatRepo: IChatRepository,
        private chatSocketService: IChatSocketService
    ) { }

    async execute(senderId: string, senderRole: string, receiverId: string, receiverRole: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<Message> {

        const mapRoleToModel = (role: string) => {
            if (role.toLowerCase() === 'student') return 'Students';
            if (role.toLowerCase() === 'teacher') return 'Teacher';
            if (role === 'Conversation') return 'Conversation';
            return 'Students';
        };

        const senderModel = mapRoleToModel(senderRole) as 'Students' | 'Teacher';
        const receiverModel = mapRoleToModel(receiverRole || 'teacher') as 'Students' | 'Teacher' | 'Conversation';

        const message = await this.chatRepo.saveMessage({
            senderId: senderId as any,
            senderModel,
            receiverId: receiverId as any,
            receiverModel,
            content,
            type,
            read: false,
            timestamp: new Date()
        });

        let participants: string[] = [];

        if (receiverModel === 'Conversation') {
            await this.chatRepo.updateConversationLastMessage(receiverId, message.id);

            const conversation = await this.chatRepo.findConversationById(receiverId);
            if (conversation && conversation.participants) {
                participants = conversation.participants.map(p =>
                    p.participantId // In domain entity, participantId is a string ID
                );
            }
        } else {
            await this.chatRepo.createOrUpdateConversation(senderId, senderModel, receiverId, receiverModel, message.id);
        }

        this.chatSocketService.emitNewMessage(
            receiverId,
            message,
            receiverModel === 'Conversation',
            participants
        );

        return message;
    }
}
