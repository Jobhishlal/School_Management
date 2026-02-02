import { AISession } from "../../../../domain/entities/AISession";

export interface IGetStudentChatHistoryUseCase {
    execute(studentId: string): Promise<AISession[]>;
}
