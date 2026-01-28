import { Message } from "../../../entities/Message";

export interface IGetMessagesUseCase {
    execute(senderId: string, receiverId: string): Promise<Message[]>;
}
