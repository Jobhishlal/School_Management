import { Request, Response } from "express";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { getIO } from "../../../../infrastructure/socket/socket";
import { ISendMessageUseCase } from "../../../../domain/interfaces/useCases/Chat/ISendMessageUseCase";
import { IGetConversationsUseCase } from "../../../../domain/interfaces/useCases/Chat/IGetConversationsUseCase";
import { IGetMessagesUseCase } from "../../../../domain/interfaces/useCases/Chat/IGetMessagesUseCase";
import { IMarkMessagesReadUseCase } from "../../../../domain/interfaces/useCases/Chat/IMarkMessagesReadUseCase";
import { MongoTeacher } from "../../../../infrastructure/repositories/MongoTeacherRepo";
import { IEditMessageUseCase } from "../../../../domain/interfaces/useCases/Chat/IEditMessageUseCase";
import { ICreateClassGroupChatUseCase } from "../../../../domain/interfaces/useCases/Chat/ICreateClassGroupChatUseCase";
import { IChatRepository } from "../../../../domain/repositories/Chat/IChatRepository";
import { ISearchChatUsersUseCase } from "../../../../domain/interfaces/useCases/Chat/ISearchChatUsersUseCase";
export class ChatController {
    constructor(
        private sendMessageUseCase: ISendMessageUseCase,
        private getConversationsUseCase: IGetConversationsUseCase,
        private getMessagesUseCase: IGetMessagesUseCase,
        private markMessagesReadUseCase: IMarkMessagesReadUseCase,
        private teacherRepo: MongoTeacher,
        private createClassGroupChatUseCase: ICreateClassGroupChatUseCase,
        private chatRepo: IChatRepository,
        private editMessageUseCase: IEditMessageUseCase,
        private searchchatUsecase : ISearchChatUsersUseCase
    ) { }


    getTeachersForStudent = async (req: Request, res: Response) => {
        try {
            const teachers = await this.teacherRepo.findAll();
            const formattedTeachers = teachers.map(t => ({
                _id: t.id,
                name: t.name,
                email: t.email,
                profileImage: '', 
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

            const mapRoleToModel = (role: string) => {
                if (role.toLowerCase() === 'student') return 'Students';
                if (role.toLowerCase() === 'teacher') return 'Teacher';
                if (role === 'Conversation') return 'Conversation';
                return 'Students'; 
            };

            const senderModel = mapRoleToModel(senderRole) as 'Students' | 'Teacher';
            const receiverModel = mapRoleToModel(receiverRole || 'teacher') as 'Students' | 'Teacher' | 'Conversation';

            const message = await this.sendMessageUseCase.execute(senderId, senderModel, receiverId, receiverModel, content, type);

           
            try {
                const io = getIO();

                if (receiverModel === 'Conversation') {
                    const conversation = await this.chatRepo.findConversationById(receiverId);
                    if (conversation && conversation.participants) {
                        conversation.participants.forEach(participant => {
                    
                            const participantId = (participant.participantId as any)._id
                                ? (participant.participantId as any)._id.toString()
                                : participant.participantId.toString();

                        
                            io.to(participantId).emit('receive_private_message', message);

                     
                            io.to(participantId).emit('receive_message', message);
                        });
                    }
                } else {
                    io.to(receiverId).emit('receive_message', message);
                    io.to(receiverId).emit('receive_private_message', message);

                    io.to(senderId).emit('receive_private_message', message);
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
            const { classId, customName } = req.body;

            if (!creatorId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
            }

            if (!classId) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Class ID is required" });
            }

            const conversation = await this.createClassGroupChatUseCase.execute(classId, creatorId, customName);

            res.status(StatusCodes.OK).json({ success: true, data: conversation });
        } catch (error) {
            console.error("Error creating class group:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to create class group" });
        }
    }

    editMessage = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            const { messageId, content } = req.body;

            if (!userId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
            }

            const updatedMessage = await this.editMessageUseCase.execute(messageId, userId, content);

            try {
                const io = getIO();
                
                if (updatedMessage.receiverModel === 'Conversation') {
        
                    const convId = updatedMessage.receiverId.toString();
                    const conversation = await this.chatRepo.findConversationById(convId);
                    if (conversation && conversation.participants) {
                        conversation.participants.forEach(p => {
                            const pId = (p.participantId as any)._id
                                ? (p.participantId as any)._id.toString()
                                : p.participantId.toString();
                            io.to(pId).emit('message_updated', updatedMessage);
                        });
                    }

                } else {
                    io.to(updatedMessage.receiverId.toString()).emit('message_updated', updatedMessage);
                    io.to(updatedMessage.senderId.toString()).emit('message_updated', updatedMessage);
                }
            } catch (e) {
                console.error("Socket emit failed", e);
            }

            res.status(StatusCodes.OK).json({ success: true, data: updatedMessage });
        } catch (error: any) {
            console.error("Error editing message:", error);
            if (error.message.includes("Time limit")) {
                return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to edit message" });
        }
    }
}
