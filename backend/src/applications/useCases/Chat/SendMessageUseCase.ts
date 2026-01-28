import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { IMessage } from "../../../infrastructure/database/mongoDB/models/MessageModel";

export interface ISendMessageUseCase {
    execute(senderId: string, senderModel: 'Students' | 'Teacher', receiverId: string, receiverModel: 'Students' | 'Teacher' | 'Conversation', content: string, type?: 'text' | 'image' | 'file'): Promise<IMessage>;
}

export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(senderId: string, senderModel: 'Students' | 'Teacher', receiverId: string, receiverModel: 'Students' | 'Teacher' | 'Conversation', content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<IMessage> {

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

        if (receiverModel === 'Conversation') {
            await this.chatRepo.updateConversationLastMessage(receiverId, message.id);
        } else {
            await this.chatRepo.createOrUpdateConversation(senderId, senderModel, receiverId, receiverModel, message.id);
        }

        return message;
    }
}
