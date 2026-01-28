import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { Message } from "../../../domain/entities/Message";
import { IGetMessagesUseCase } from "../../../domain/interfaces/useCases/Chat/IGetMessagesUseCase";

export class GetMessagesUseCase implements IGetMessagesUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(senderId: string, receiverId: string): Promise<Message[]> {
        // Check if receiverId is a group/conversation
        const conversation = await this.chatRepo.findConversationById(receiverId);

        if (conversation && conversation.isGroup) {
            return await this.chatRepo.getGroupMessages(receiverId);
        }

        return await this.chatRepo.getMessages(senderId, receiverId);
    }
}
