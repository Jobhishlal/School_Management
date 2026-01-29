
import { Request, Response } from "express";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { CHAT_ERRORS } from "../../../../shared/constants/errorMessages";
import { ISendMessageUseCase } from "../../../../domain/interfaces/useCases/Chat/ISendMessageUseCase";
import { IGetConversationsUseCase } from "../../../../domain/interfaces/useCases/Chat/IGetConversationsUseCase";
import { IGetMessagesUseCase } from "../../../../domain/interfaces/useCases/Chat/IGetMessagesUseCase";
import { IMarkMessagesReadUseCase } from "../../../../domain/interfaces/useCases/Chat/IMarkMessagesReadUseCase";
import { IEditMessageUseCase } from "../../../../domain/interfaces/useCases/Chat/IEditMessageUseCase";
import { ICreateClassGroupChatUseCase } from "../../../../domain/interfaces/useCases/Chat/ICreateClassGroupChatUseCase";
import { IDeleteMessageUseCase } from "../../../../domain/interfaces/useCases/Chat/IDeleteMessageUseCase";
import { IGetTeachersForChatUseCase } from "../../../../domain/interfaces/useCases/Chat/IGetTeachersForChatUseCase";
import { ISearchChatUsersUseCase } from "../../../../domain/interfaces/useCases/Chat/ISearchChatUsersUseCase";
import { ChatDTOMapper } from "../../../../domain/Mapper/ChatDTOMapper";

export class SchoolChatController {
    constructor(
        private sendMessageUseCase: ISendMessageUseCase,
        private getConversationsUseCase: IGetConversationsUseCase,
        private getMessagesUseCase: IGetMessagesUseCase,
        private markMessagesReadUseCase: IMarkMessagesReadUseCase,
        private teachersForChatUseCase: IGetTeachersForChatUseCase,
        private createClassGroupChatUseCase: ICreateClassGroupChatUseCase,
        private editMessageUseCase: IEditMessageUseCase,
        private deleteMessageUseCase: IDeleteMessageUseCase,
        private searchChatUsersUseCase: ISearchChatUsersUseCase
    ) { }

    getTeachersForStudent = async (req: Request, res: Response) => {
        try {
            const teachers = await this.teachersForChatUseCase.execute();

            res.status(StatusCodes.OK).json({ success: true, data: teachers });
        } catch (error) {
            console.error("Error fetching teachers for chat:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: CHAT_ERRORS.TEACHER_FETCH_FAILED });
        }
    }

    sendMessage = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const senderId = authReq.user?.id;
            const senderRole = authReq.user?.role;
            const { receiverId, receiverRole, content, type } = req.body;

            if (!senderId || !senderRole) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: CHAT_ERRORS.UNAUTHORIZED });
            }

            const message = await this.sendMessageUseCase.execute(senderId, senderRole, receiverId, receiverRole, content, type);

            res.status(StatusCodes.OK).json({ success: true, data: ChatDTOMapper.toMessageDTO(message) });
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: CHAT_ERRORS.SEND_MESSAGE_FAILED });
        }
    }

    getConversations = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ message: CHAT_ERRORS.UNAUTHORIZED });

            const conversations = await this.getConversationsUseCase.execute(userId);
            res.status(StatusCodes.OK).json({
                success: true,
                data: conversations.map(c => ChatDTOMapper.toConversationDTO(c))
            });
        } catch (error) {
            console.error("Error fetching conversations:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: CHAT_ERRORS.FETCH_CONVERSATIONS_FAILED });
        }
    }

    getChatHistory = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            const { otherUserId } = req.params;

            if (!userId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: CHAT_ERRORS.UNAUTHORIZED });
            }

            const messages = await this.getMessagesUseCase.execute(userId, otherUserId);
            res.status(StatusCodes.OK).json({
                success: true,
                data: messages.map(m => ChatDTOMapper.toMessageDTO(m))
            });
        } catch (error) {
            console.error("Error fetching chat history:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: CHAT_ERRORS.FETCH_HISTORY_FAILED });
        }
    }

    markAsRead = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            const { otherUserId } = req.body;

            if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ message: CHAT_ERRORS.UNAUTHORIZED });

            await this.markMessagesReadUseCase.execute(otherUserId, userId);

            res.status(StatusCodes.OK).json({ success: true, message: "Marked as read" });
        } catch (error) {
            console.error("Error marking messages as read:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: CHAT_ERRORS.MARK_READ_FAILED });
        }
    }

    uploadFile = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: CHAT_ERRORS.NO_FILE_UPLOADED });
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: CHAT_ERRORS.FILE_UPLOAD_FAILED });
        }
    }

    createClassGroup = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const creatorId = authReq.user?.id;
            const { classId, customName } = req.body;

            if (!creatorId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: CHAT_ERRORS.UNAUTHORIZED });
            }

            if (!classId) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: CHAT_ERRORS.CLASS_ID_REQUIRED });
            }

            const conversation = await this.createClassGroupChatUseCase.execute(classId, creatorId, customName);

            res.status(StatusCodes.OK).json({ success: true, data: ChatDTOMapper.toConversationDTO(conversation) });
        } catch (error) {
            console.error("Error creating class group:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: CHAT_ERRORS.CREATE_GROUP_FAILED });
        }
    }

    editMessage = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            const { messageId, content } = req.body;

            if (!userId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: CHAT_ERRORS.UNAUTHORIZED });
            }

            const updatedMessage = await this.editMessageUseCase.execute(messageId, userId, content);

            res.status(StatusCodes.OK).json({ success: true, data: ChatDTOMapper.toMessageDTO(updatedMessage) });
        } catch (error: any) {
            console.error("Error editing message:", error);
            if (error.message.includes("Time limit")) {
                return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: CHAT_ERRORS.EDIT_MESSAGE_FAILED });
        }
    }

    deleteMessage = async (req: Request, res: Response) => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            const { messageId } = req.body;
            console.log(`[SchoolChatController] deleteMessage called. Body:`, req.body);
            if (!userId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: CHAT_ERRORS.UNAUTHORIZED });
            }

            const deletedMessage = await this.deleteMessageUseCase.execute(messageId, userId);

            res.status(StatusCodes.OK).json({ success: true, data: ChatDTOMapper.toMessageDTO(deletedMessage) });
        } catch (error: any) {
            console.error("Error deleting message:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: CHAT_ERRORS.DELETE_MESSAGE_FAILED });
        }
    }

    searchUsers = async (req: Request, res: Response) => {
        try {
            const { query, role } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: CHAT_ERRORS.QUERY_REQUIRED });
            }

            const users = await this.searchChatUsersUseCase.execute(query, role as string);

            res.status(StatusCodes.OK).json({ success: true, data: users });
        } catch (error) {
            console.error("Error searching users:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: CHAT_ERRORS.SEARCH_FAILED });
        }
    }
}
