import { Message } from "../../../../domain/entities/Message";
import { DeleteMessageRequestDTO } from "../../../dto/ChatDTOs";

export interface IDeleteMessageUseCase {
    execute(dto: DeleteMessageRequestDTO, userId: string): Promise<Message>;
}
