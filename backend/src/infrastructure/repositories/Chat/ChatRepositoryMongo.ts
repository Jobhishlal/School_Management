import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { MessageModel, IMessage } from "../../database/mongoDB/models/MessageModel";
import { ConversationModel, IConversation } from "../../database/mongoDB/models/ConversationModel";
// Ensure models are registered for population
import { StudentModel } from "../../database/models/StudentModel";
import { TeacherModel } from "../../database/models/Teachers";

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
        // Find if conversation exists between these two
        // We need to match precise participants AND ensure it is NOT a group chat
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
            // Self-healing: Ensure participants are correct (e.g. if model name was wrong in DB)
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

    async getConversations(userId: string): Promise<IConversation[]> {
        const conversations = await ConversationModel.find({
            "participants.participantId": userId
        })
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .lean();

        // Manual Population and Unread Count Calculation
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
                // For groups, count messages sent to the group that are unread
                // Note: This is a shared read status (limitation of current model)
                // Checking if the current user is NOT the sender is important but senderId is on message
                // simplified: count unread messages in this group where sender != userId
                unreadCount = await MessageModel.countDocuments({
                    receiverId: conv._id,
                    senderId: { $ne: userId },
                    read: false
                });
            } else if (otherParticipant) {
                // For 1-on-1, count messages sent BY the other person TO me that are unread
                // We need the ID of the other participant. 
                // Note: populatedParticipants has objects, conv.participants has OIDs if not populated?
                // conv was .lean(), so it has OIDs.
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

        return populatedConversations as any[];
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

    async updateMessage(messageId: string, content: string): Promise<IMessage | null> {
        return await MessageModel.findByIdAndUpdate(
            messageId,
            { content, isEdited: true },
            { new: true }
        );
    }

    async markMessageAsDeleted(messageId: string): Promise<IMessage | null> {
        return await MessageModel.findByIdAndUpdate(
            messageId,
            { isDeleted: true },
            { new: true }
        );
    }

    async findMessageById(messageId: string): Promise<IMessage | null> {
        return await MessageModel.findById(messageId);
    }
}
