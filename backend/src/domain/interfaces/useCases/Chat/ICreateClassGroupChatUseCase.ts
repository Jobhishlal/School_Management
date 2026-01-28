import { Conversation } from "../../../entities/Conversation";

export interface ICreateClassGroupChatUseCase {
    execute(classId: string, creatorId: string, customName?: string): Promise<Conversation>;
}
