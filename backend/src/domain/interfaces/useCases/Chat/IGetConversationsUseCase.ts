import { Conversation } from "../../../entities/Conversation";

export interface IGetConversationsUseCase {
    execute(userId: string): Promise<Conversation[]>;
}
