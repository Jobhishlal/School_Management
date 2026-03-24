import { Message } from "../../../../domain/entities/Message";
import { SendMessageRequestDTO } from "../../../dto/ChatDTOs";

export interface ISendMessageUseCase {
    execute(dto: SendMessageRequestDTO, senderId: string, senderRole: string): Promise<Message>;
}
