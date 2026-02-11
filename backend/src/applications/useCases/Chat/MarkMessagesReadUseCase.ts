import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { IMarkMessagesReadUseCase } from "../../interface/UseCaseInterface/Chat/IMarkMessagesReadUseCase";
import { IChatSocketService } from "../../../infrastructure/services/IChatSocketService";

export class MarkMessagesReadUseCase implements IMarkMessagesReadUseCase {
    constructor(
        private chatRepo: IChatRepository,
        private chatSocketService: IChatSocketService
    ) { }

    async execute(senderId: string, receiverId: string): Promise<void> {
        await this.chatRepo.markMessagesAsRead(senderId, receiverId);
        this.chatSocketService.emitMessagesRead(receiverId, senderId);
    }
}
