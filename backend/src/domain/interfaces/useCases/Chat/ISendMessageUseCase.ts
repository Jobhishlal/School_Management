import { Message } from "../../../entities/Message";

export interface ISendMessageUseCase {
    execute(senderId: string, senderRole: string, receiverId: string, receiverRole: string, content: string, type?: 'text' | 'image' | 'file'): Promise<Message>;
}
