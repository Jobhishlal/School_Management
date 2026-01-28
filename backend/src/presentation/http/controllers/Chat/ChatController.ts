import { Request, Response } from "express";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { getIO } from "../../../../infrastructure/socket/socket";
import { ISendMessageUseCase } from "../../../../applications/useCases/Chat/SendMessageUseCase";
import { IGetConversationsUseCase } from "../../../../applications/useCases/Chat/GetConversationsUseCase";
import { IGetMessagesUseCase } from "../../../../applications/useCases/Chat/GetMessagesUseCase";
import { IMarkMessagesReadUseCase } from "../../../../applications/useCases/Chat/MarkMessagesReadUseCase";
import { MongoTeacher } from "../../../../infrastructure/repositories/MongoTeacherRepo";
import { ICreateClassGroupChatUseCase } from "../../../../applications/useCases/Chat/CreateClassGroupChatUseCase";
import { IChatRepository } from "../../../../domain/repositories/Chat/IChatRepository";

export class ChatController {
    constructor(
        private sendMessageUseCase: ISendMessageUseCase,
        private getConversationsUseCase: IGetConversationsUseCase,
        private getMessagesUseCase: IGetMessagesUseCase,
        private markMessagesReadUseCase: IMarkMessagesReadUseCase,
        private teacherRepo: MongoTeacher,
        private createClassGroupChatUseCase: ICreateClassGroupChatUseCase,
        private chatRepo: IChatRepository
    ) { }

    // Get list of teachers for student to chat with (Legacy/Specific functionality)
    getTeachersForStudent = async (req: Request, res: Response) => {
        try {
            const teachers = await this.teacherRepo.findAll();
            const formattedTeachers = teachers.map(t => ({
                _id: t.id,
                name: t.name,
                email: t.email,
                profileImage: '', // Teacher entity might not have profileImage directly exposed
                role: 'teacher'
            }));
            res.status(StatusCodes.OK).json({ success: true, data: formattedTeachers });
        } catch (error) {
            console.error("Error fetching teachers for chat:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch teachers" });
        }
    }

    sendMessage = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const senderId = authReq.user?.id;
            const senderRole = authReq.user?.role;
            const { receiverId, receiverRole, content, type } = req.body;

            if (!senderId || !senderRole) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
            }

            // Map roles to specific Model names
            const mapRoleToModel = (role: string) => {
                if (role.toLowerCase() === 'student') return 'Students';
                if (role.toLowerCase() === 'teacher') return 'Teacher';
                if (role === 'Conversation') return 'Conversation';
                return 'Students'; // Default or error?
            };

            const senderModel = mapRoleToModel(senderRole) as 'Students' | 'Teacher';
            const receiverModel = mapRoleToModel(receiverRole || 'teacher') as 'Students' | 'Teacher' | 'Conversation';

            const message = await this.sendMessageUseCase.execute(senderId, senderModel, receiverId, receiverModel, content, type);

            // Socket emission
            try {
                const io = getIO();

                if (receiverModel === 'Conversation') {
                    const conversation = await this.chatRepo.findConversationById(receiverId);
                    if (conversation && conversation.participants) {
                        conversation.participants.forEach(participant => {
                            // Cast to any because sometimes mongoose refs behave differently, but usually safe as string or ObjectId
                            const participantId = (participant.participantId as any)._id
                                ? (participant.participantId as any)._id.toString()
                                : participant.participantId.toString();

                            // Emit to each participant (including sender, though frontend often handles optimistic UI)
                            io.to(participantId).emit('receive_private_message', message);

                            // Also emit general receive_message for compatibility
                            io.to(participantId).emit('receive_message', message);
                        });
                    }
                } else {
                    io.to(receiverId).emit('receive_message', message);
                    io.to(receiverId).emit('receive_private_message', message);
                }
            } catch (e) {
                console.error("Socket emit failed", e);
            }

            res.status(StatusCodes.OK).json({ success: true, data: message });
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to send message" });
        }
    }

    getConversations = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });

            const conversations = await this.getConversationsUseCase.execute(userId);
            res.status(StatusCodes.OK).json({ success: true, data: conversations });
        } catch (error) {
            console.error("Error fetching conversations:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch conversations" });
        }
    }

    getChatHistory = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            const { otherUserId } = req.params;

            if (!userId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
            }

            const messages = await this.getMessagesUseCase.execute(userId, otherUserId);
            res.status(StatusCodes.OK).json({ success: true, data: messages });
        } catch (error) {
            console.error("Error fetching chat history:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch history" });
        }
    }

    markAsRead = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            const { otherUserId } = req.body;

            if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });

            await this.markMessagesReadUseCase.execute(otherUserId, userId);

            try {
                const io = getIO();
                io.to(otherUserId).emit('messages_read', { readerId: userId });
            } catch (e) {
                console.error("Socket emit failed (ignoring)", e);
            }

            res.status(StatusCodes.OK).json({ success: true, message: "Marked as read" });
        } catch (error) {
            console.error("Error marking messages as read:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to mark read" });
        }
    }
    uploadFile = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "No file uploaded" });
            }
            // req.file is populated by multer-storage-cloudinary
            const fileUrl = req.file.path;
            const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'file';

            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    url: fileUrl,
                    type: fileType,
                    filename: req.file.originalname
                }
            });
        } catch (error) {
            console.error("Error uploading file:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "File upload failed" });
        }
    }

    createClassGroup = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const creatorId = authReq.user?.id;
            const { classId } = req.body;

            if (!creatorId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
            }

            if (!classId) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Class ID is required" });
            }

            const conversation = await this.createClassGroupChatUseCase.execute(classId, creatorId);

            res.status(StatusCodes.OK).json({ success: true, data: conversation });
        } catch (error) {
            console.error("Error creating class group:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to create class group" });
        }
    }
}
