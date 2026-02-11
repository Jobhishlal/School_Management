import { Message } from "../../../../domain/entities/Message";

export interface IGetMessagesUseCase {
    execute(senderId: string, receiverId: string): Promise<Message[]>;
}
