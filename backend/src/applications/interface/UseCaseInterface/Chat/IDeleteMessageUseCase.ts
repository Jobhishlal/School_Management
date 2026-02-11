import { Message } from "../../../../domain/entities/Message";

export interface IDeleteMessageUseCase {
    execute(messageId: string, userId: string): Promise<Message>;
}
