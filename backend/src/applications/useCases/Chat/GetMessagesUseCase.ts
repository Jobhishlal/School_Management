import { IChatRepository } from "../../interface/RepositoryInterface/Chat/IChatRepository";
import { Message } from "../../../domain/entities/Message";
import { IGetMessagesUseCase } from "../../interface/UseCaseInterface/Chat/IGetMessagesUseCase";

export class GetMessagesUseCase implements IGetMessagesUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(senderId: string, receiverId: string): Promise<Message[]> {
     
        const conversation = await this.chatRepo.findConversationById(receiverId);

        if (conversation && conversation.isGroup) {
            return await this.chatRepo.getGroupMessages(receiverId);
        }

        return await this.chatRepo.getMessages(senderId, receiverId);
    }
}
