import { Message } from "../../../../domain/entities/Message";

export interface IEditMessageUseCase {
    execute(messageId: string, userId: string, newContent: string): Promise<Message>;
}
