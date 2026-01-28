import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { IMessage } from "../../../infrastructure/database/mongoDB/models/MessageModel";

export interface IGetMessagesUseCase {
    execute(senderId: string, receiverId: string): Promise<IMessage[]>;
}

export class GetMessagesUseCase implements IGetMessagesUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(senderId: string, receiverId: string): Promise<IMessage[]> {
        // Check if receiverId is a group/conversation
        const conversation = await this.chatRepo.findConversationById(receiverId);

        if (conversation && conversation.isGroup) {
            return await this.chatRepo.getGroupMessages(receiverId);
        }

        return await this.chatRepo.getMessages(senderId, receiverId);
    }
}
