import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { MessageModel, IMessage } from "../../database/mongoDB/models/MessageModel";
import { ConversationModel, IConversation } from "../../database/mongoDB/models/ConversationModel";

export class ChatRepositoryMongo implements IChatRepository {

    async saveMessage(messageData: Partial<IMessage>): Promise<IMessage> {
        const message = new MessageModel(messageData);
        return await message.save();
    }

    async getMessages(senderId: string, receiverId: string): Promise<IMessage[]> {
        return await MessageModel.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 1 });
    }

    async createOrUpdateConversation(senderId: string, senderModel: string, receiverId: string, receiverModel: string, lastMessageId: string): Promise<void> {
        // Find if conversation exists between these two
        // We need to match precise participants
        let conversation = await ConversationModel.findOne({
            $and: [
                { participants: { $elemMatch: { participantId: senderId, participantModel: senderModel } } },
                { participants: { $elemMatch: { participantId: receiverId, participantModel: receiverModel } } }
            ]
        });

        if (conversation) {
            conversation.lastMessage = lastMessageId as any;
            conversation.updatedAt = new Date();
            await conversation.save();
        } else {
            await ConversationModel.create({
                participants: [
                    { participantId: senderId, participantModel: senderModel },
                    { participantId: receiverId, participantModel: receiverModel }
                ],
                lastMessage: lastMessageId
            });
        }
    }

    async getConversations(userId: string): Promise<IConversation[]> {
        return await ConversationModel.find({
            "participants.participantId": userId
        })
            .populate({
                path: 'participants.participantId',
                select: 'name email profileImage role fullName studentId' // Select fields common or specific to both
            })
            .populate('lastMessage')
            .sort({ updatedAt: -1 });
    }

    async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
        await MessageModel.updateMany(
            { senderId, receiverId, read: false },
            { $set: { read: true } }
        );
    }

    async createGroupConversation(groupName: string, participantIds: { participantId: string, participantModel: string }[], classId?: string): Promise<any> {
        return await ConversationModel.create({
            isGroup: true,
            groupName,
            classId,
            participants: participantIds,
            updatedAt: new Date()
        });
    }

    async updateConversationLastMessage(conversationId: string, messageId: string): Promise<void> {
        await ConversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: messageId,
            updatedAt: new Date()
        });
    }

    async findConversationById(conversationId: string): Promise<IConversation | null> {
        return await ConversationModel.findById(conversationId);
    }

    async getGroupMessages(groupId: string): Promise<IMessage[]> {
        return await MessageModel.find({ receiverId: groupId }).sort({ timestamp: 1 });
    }
}
