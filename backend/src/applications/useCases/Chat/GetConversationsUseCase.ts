import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { Conversation } from "../../../domain/entities/Conversation";
import { IGetConversationsUseCase } from "../../interface/UseCaseInterface/Chat/IGetConversationsUseCase";

export class GetConversationsUseCase implements IGetConversationsUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(userId: string): Promise<Conversation[]> {
        return await this.chatRepo.getConversations(userId);
    }
}
