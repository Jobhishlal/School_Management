import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { IConversation } from "../../../infrastructure/database/mongoDB/models/ConversationModel";

export interface IGetConversationsUseCase {
    execute(userId: string): Promise<any[]>;
}

export class GetConversationsUseCase implements IGetConversationsUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(userId: string): Promise<any[]> {
        return await this.chatRepo.getConversations(userId);
    }
}
