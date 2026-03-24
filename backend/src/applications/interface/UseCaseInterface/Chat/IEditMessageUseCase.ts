import { Message } from "../../../../domain/entities/Message";
import { EditMessageRequestDTO } from "../../../dto/ChatDTOs";

export interface IEditMessageUseCase {
    execute(dto: EditMessageRequestDTO, userId: string): Promise<Message>;
}
