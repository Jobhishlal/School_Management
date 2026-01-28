import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { MessageModel, IMessage } from "../../database/mongoDB/models/MessageModel";
import { ConversationModel, IConversation } from "../../database/mongoDB/models/ConversationModel";
import { StudentModel } from "../../database/models/StudentModel";
import { TeacherModel } from "../../database/models/Teachers";
import { Message } from "../../../domain/entities/Message";
import { Conversation } from "../../../domain/entities/Conversation";
import { ChatPersistenceMapper } from "../../mappers/ChatPersistenceMapper";

export class ChatRepositoryMongo implements IChatRepository {

    async saveMessage(messageData: Partial<IMessage>): Promise<Message> {
        const message = new MessageModel(messageData);
        const savedMessage = await message.save();
        return ChatPersistenceMapper.toDomainMessage(savedMessage);
    }

    async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
        const messages = await MessageModel.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 1 });
        return messages.map(msg => ChatPersistenceMapper.toDomainMessage(msg));
    }

    async createOrUpdateConversation(senderId: string, senderModel: string, receiverId: string, receiverModel: string, lastMessageId: string): Promise<void> {

        let conversation = await ConversationModel.findOne({
            $and: [
                { participants: { $elemMatch: { participantId: senderId, participantModel: senderModel } } },
                { participants: { $elemMatch: { participantId: receiverId, participantModel: receiverModel } } },
                { isGroup: false }
            ]
        });

        if (conversation) {
            conversation.lastMessage = lastMessageId as any;
            conversation.updatedAt = new Date();

            conversation.participants = [
                { participantId: senderId, participantModel: senderModel },
                { participantId: receiverId, participantModel: receiverModel }
            ] as any;
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

    async getConversations(userId: string): Promise<Conversation[]> {
        const conversations = await ConversationModel.find({
            "participants.participantId": userId
        })
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .lean();


        const populatedConversations = await Promise.all(conversations.map(async (conv) => {
            const populatedParticipants = await Promise.all(conv.participants.map(async (p) => {
                const model = p.participantModel?.toLowerCase();
                if (model === 'students' || model === 'student') {
                    const student = await StudentModel.findById(p.participantId).select('fullName email photos role studentId');
                    if (student) {
                        return {
                            ...p,
                            participantId: {
                                _id: student._id.toString(),
                                name: student.fullName || 'Unknown Student',
                                fullName: student.fullName || 'Unknown Student',
                                email: (student as any).email || '',
                                profileImage: student.photos?.[0]?.url || '',
                                role: 'student',
                                studentId: student.studentId
                            }
                        };
                    }
                } else if (model === 'teacher' || model === 'teachers') {
                    const teacher = await TeacherModel.findById(p.participantId).select('name email role');
                    if (teacher) {
                        return {
                            ...p,
                            participantId: {
                                _id: teacher._id.toString(),
                                name: teacher.name || 'Unknown Teacher',
                                fullName: teacher.name || 'Unknown Teacher', // Teacher usually has 'name'
                                email: teacher.email,
                                profileImage: '',
                                role: 'teacher'
                            }
                        };
                    }
                }
                return p;
            }));

            // Calculate unread count
            const otherParticipant = conv.participants.find((p: any) =>
                p.participantId && p.participantId.toString() !== userId
            );

            let unreadCount = 0;
            if (conv.isGroup) {

                unreadCount = await MessageModel.countDocuments({
                    receiverId: conv._id,
                    senderId: { $ne: userId },
                    read: false
                });
            } else if (otherParticipant) {

                const otherId = otherParticipant.participantId;
                unreadCount = await MessageModel.countDocuments({
                    senderId: otherId,
                    receiverId: userId,
                    read: false
                });
            }

            return {
                ...conv,
                participants: populatedParticipants,
                unreadCount
            };
        }));

        return populatedConversations.map(conv => ChatPersistenceMapper.toDomainConversation(conv));
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

    async findConversationById(conversationId: string): Promise<Conversation | null> {
        const conversation = await ConversationModel.findById(conversationId).populate('lastMessage');
        // Note: Participants need to be populated logic if we want full details, 
        // but typically findById in your flow might just need basic data or the participants structure.
        // Your current mapper handles both populated and unpopulated gracefully.
        return conversation ? ChatPersistenceMapper.toDomainConversation(conversation) : null;
    }

    async getGroupMessages(groupId: string): Promise<Message[]> {
        const messages = await MessageModel.find({ receiverId: groupId }).sort({ timestamp: 1 });
        return messages.map(msg => ChatPersistenceMapper.toDomainMessage(msg));
    }

    async updateMessage(messageId: string, content: string): Promise<Message | null> {
        const msg = await MessageModel.findByIdAndUpdate(
            messageId,
            { content, isEdited: true },
            { new: true }
        );
        return msg ? ChatPersistenceMapper.toDomainMessage(msg) : null;
    }

    async markMessageAsDeleted(messageId: string): Promise<Message | null> {
        const msg = await MessageModel.findByIdAndUpdate(
            messageId,
            { isDeleted: true },
            { new: true }
        );
        return msg ? ChatPersistenceMapper.toDomainMessage(msg) : null;
    }

    async findMessageById(messageId: string): Promise<Message | null> {
        const msg = await MessageModel.findById(messageId);
        return msg ? ChatPersistenceMapper.toDomainMessage(msg) : null;
    }
}
