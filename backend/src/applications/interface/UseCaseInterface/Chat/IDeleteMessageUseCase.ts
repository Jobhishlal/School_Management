import { Message } from "../../../entities/Message";

export interface IDeleteMessageUseCase {
    execute(messageId: string, userId: string): Promise<Message>;
}
