import { IAISessionRepository } from "../../../domain/repositories/AI/IAISessionRepository";
import { AISession, AIChatMessage } from "../../../domain/entities/AISession";
import { AISessionModel } from "../../database/models/AISessionModel";

export class MongoAISessionRepo implements IAISessionRepository {

    async create(session: AISession): Promise<AISession> {
        const newSession = await AISessionModel.create({
            studentId: session.studentId,
            title: session.title,
            messages: session.messages
        });

        return new AISession(
            (newSession as any)._id.toString(),
            newSession.studentId,
            newSession.title,
            newSession.messages,
            newSession.createdAt,
            newSession.updatedAt
        );
    }

    async findById(id: string): Promise<AISession | null> {
        const session = await AISessionModel.findById(id);
        if (!session) return null;

        return new AISession(
            (session as any)._id.toString(),
            session.studentId,
            session.title,
            session.messages,
            session.createdAt,
            session.updatedAt
        );
    }

    async findByStudentId(studentId: string): Promise<AISession[]> {
        const sessions = await AISessionModel.find({ studentId }).sort({ updatedAt: -1 });

        return sessions.map(session => new AISession(
            (session as any)._id.toString(),
            session.studentId,
            session.title,
            session.messages,
            session.createdAt,
            session.updatedAt
        ));
    }

    async addMessage(sessionId: string, message: AIChatMessage): Promise<void> {
        await AISessionModel.findByIdAndUpdate(sessionId, {
            $push: { messages: message },
            $set: { updatedAt: new Date() }
        });
    }

    async updateTitle(sessionId: string, title: string): Promise<void> {
        await AISessionModel.findByIdAndUpdate(sessionId, { title });
    }

    async delete(sessionId: string): Promise<void> {
        await AISessionModel.findByIdAndDelete(sessionId);
    }
}
