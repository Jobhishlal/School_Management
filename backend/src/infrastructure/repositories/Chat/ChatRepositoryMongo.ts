import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { MessageModel, IMessage } from "../../database/mongoDB/models/MessageModel";
import { ConversationModel, IConversation } from "../../database/mongoDB/models/ConversationModel";
import { StudentModel } from "../../database/models/StudentModel";
import { TeacherModel } from "../../database/models/Teachers";
import { Message } from "../../../domain/entities/Message";
import { Conversation } from "../../../domain/entities/Conversation";
import { ChatPersistenceMapper } from "../../mappers/ChatPersistenceMapper";
import mongoose from "mongoose";



export class ChatRepositoryMongo implements IChatRepository {

    private async resolveParticipantId(id: string, model: string): Promise<string> {
        if (mongoose.Types.ObjectId.isValid(id)) return id;

        if (model?.toLowerCase() === 'students' || model?.toLowerCase() === 'student') {
            const student = await StudentModel.findOne({ studentId: id }).select('_id');
            if (student) return student._id.toString();
        }
        return id;
    }

    async saveMessage(messageData: Partial<IMessage>): Promise<Message> {
        const sId = await this.resolveParticipantId(messageData.senderId as any, messageData.senderModel!);
        const rId = await this.resolveParticipantId(messageData.receiverId as any, messageData.receiverModel!);

        const message = new MessageModel({ ...messageData, senderId: sId, receiverId: rId });
        const savedMessage = await message.save();
        return ChatPersistenceMapper.toDomainMessage(savedMessage);
    }

    async getMessages(senderId: string, receiverId: string): Promise<Message[]> {

        // Check if receiverId is a Group Conversation using isValid check first to avoid casting errors
        if (mongoose.Types.ObjectId.isValid(receiverId)) {
            const conversation = await ConversationModel.findById(receiverId);
            if (conversation && conversation.isGroup) {
                // It's a group! Fetch all messages sent TO this group
                const messages = await MessageModel.find({ receiverId: receiverId }).sort({ timestamp: 1 });
                return messages.map(msg => ChatPersistenceMapper.toDomainMessage(msg));
            }
        }

        const sId = await this.resolveParticipantId(senderId, 'unknown');
        const rId = await this.resolveParticipantId(receiverId, 'unknown');

        const messages = await MessageModel.find({
            $or: [
                { senderId: sId, receiverId: rId },
                { senderId: rId, receiverId: sId }
            ]
        }).sort({ timestamp: 1 });
        return messages.map(msg => ChatPersistenceMapper.toDomainMessage(msg));
    }

    async createOrUpdateConversation(senderId: string, senderModel: string, receiverId: string, receiverModel: string, lastMessageId: string): Promise<void> {

        const sId = await this.resolveParticipantId(senderId, senderModel);
        const rId = await this.resolveParticipantId(receiverId, receiverModel);

        let conversation = await ConversationModel.findOne({
            $and: [
                { participants: { $elemMatch: { participantId: sId, participantModel: senderModel } } },
                { participants: { $elemMatch: { participantId: rId, participantModel: receiverModel } } },
                { isGroup: false }
            ]
        });

        if (conversation) {
            conversation.lastMessage = lastMessageId as any;
            conversation.updatedAt = new Date();

            conversation.participants = [
                { participantId: sId, participantModel: senderModel },
                { participantId: rId, participantModel: receiverModel }
            ] as any;
            await conversation.save();
        } else {
            await ConversationModel.create({
                participants: [
                    { participantId: sId, participantModel: senderModel },
                    { participantId: rId, participantModel: receiverModel }
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
                    let student = null;
                    if (mongoose.Types.ObjectId.isValid(p.participantId as any)) {
                        student = await StudentModel.findById(p.participantId).select('fullName email photos role studentId');
                    }

                    if (!student) {
                        student = await StudentModel.findOne({ studentId: p.participantId }).select('fullName email photos role studentId');
                    }

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
                    } else {
                        console.warn(`Student not found for ID: ${p.participantId}`);
                      
                        return {
                            ...p,
                            participantId: {
                                _id: p.participantId.toString(),
                                name: 'Unknown Student',
                                fullName: 'Unknown Student',
                                email: '',
                                profileImage: '',
                                role: 'student',
                                studentId: p.participantId.toString()
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
                                fullName: teacher.name || 'Unknown Teacher', 
                                email: teacher.email,
                                profileImage: '',
                                role: 'teacher'
                            }
                        };
                    }
                }
                return p;
            }));

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

        const conversationMap = new Map<string, any>();

        populatedConversations.forEach(conv => {
            const otherParticipant = conv.participants.find((p: any) =>
                p.participantId && p.participantId._id && p.participantId._id.toString() !== userId
            );

            const key = conv.isGroup ? conv._id.toString() : (otherParticipant ? (otherParticipant.participantId as any)._id.toString() : conv._id.toString());

            if (conversationMap.has(key)) {
                const existing = conversationMap.get(key);
                // Replace if current one is newer
                if (new Date(conv.updatedAt) > new Date(existing.updatedAt)) {
                    conversationMap.set(key, conv);
                }
            } else {
                conversationMap.set(key, conv);
            }
        });

        const uniqueConversations = Array.from(conversationMap.values());

        // Sort again just to be sure
        uniqueConversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        return uniqueConversations.map(conv => ChatPersistenceMapper.toDomainConversation(conv));
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
        console.log(`[ChatRepo] Finding message by ID: '${messageId}'`);
        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            console.error(`[ChatRepo] Invalid ObjectId format for messageId: ${messageId}`);
            return null;
        }
        const msg = await MessageModel.findById(messageId);
        console.log(`[ChatRepo] Found message:`, msg ? 'YES' : 'NO');
        return msg ? ChatPersistenceMapper.toDomainMessage(msg) : null;
    }
}
