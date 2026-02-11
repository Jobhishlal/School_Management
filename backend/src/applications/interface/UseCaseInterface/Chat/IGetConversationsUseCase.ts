import { Conversation } from "../../../../domain/entities/Conversation";

export interface IGetConversationsUseCase {
    execute(userId: string): Promise<Conversation[]>;
}
