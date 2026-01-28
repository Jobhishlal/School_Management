import express from "express";
import { SchoolChatController } from "../http/controllers/Chat/SchoolChatController";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { ChatRepositoryMongo } from "../../infrastructure/repositories/Chat/ChatRepositoryMongo";
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { MongoClassRepository } from "../../infrastructure/repositories/MongoClassRepo";
import { SendMessageUseCase } from "../../applications/useCases/Chat/SendMessageUseCase";
import { GetConversationsUseCase } from "../../applications/useCases/Chat/GetConversationsUseCase";
import { GetMessagesUseCase } from "../../applications/useCases/Chat/GetMessagesUseCase";
import { MarkMessagesReadUseCase } from "../../applications/useCases/Chat/MarkMessagesReadUseCase";
import { CreateClassGroupChatUseCase } from "../../applications/useCases/Chat/CreateClassGroupChatUseCase";
import { EditMessageUseCase } from "../../applications/useCases/Chat/EditMessageUseCase";
import { DeleteMessageUseCase } from "../../applications/useCases/Chat/DeleteMessageUseCase";
import { GetTeachersForChatUseCase } from "../../applications/useCases/Chat/GetTeachersForChatUseCase";
import { SearchChatUsersUseCase } from "../../applications/useCases/Chat/SearchChatUsersUseCase";
import { ChatSocketService } from "../../infrastructure/services/ChatSocketService";
import { upload } from "../../infrastructure/middleware/fileUploadService";

const router = express.Router();

const chatRepo = new ChatRepositoryMongo();
const teacherRepo = new MongoTeacher();
const studentRepo = new MongoStudentRepo();
const classRepo = new MongoClassRepository();
const chatSocketService = new ChatSocketService();

const sendMessageUseCase = new SendMessageUseCase(chatRepo, chatSocketService);
const getConversationsUseCase = new GetConversationsUseCase(chatRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo);
const markMessagesReadUseCase = new MarkMessagesReadUseCase(chatRepo, chatSocketService);
const createClassGroupChatUseCase = new CreateClassGroupChatUseCase(chatRepo, classRepo, studentRepo, teacherRepo);
const editMessageUseCase = new EditMessageUseCase(chatRepo, chatSocketService);
const deleteMessageUseCase = new DeleteMessageUseCase(chatRepo, chatSocketService);
const getTeachersForChatUseCase = new GetTeachersForChatUseCase(teacherRepo);
const searchChatUsersUseCase = new SearchChatUsersUseCase(studentRepo, teacherRepo);

const chatController = new SchoolChatController(
    sendMessageUseCase,
    getConversationsUseCase,
    getMessagesUseCase,
    markMessagesReadUseCase,
    getTeachersForChatUseCase,
    createClassGroupChatUseCase,
    editMessageUseCase,
    deleteMessageUseCase,
    searchChatUsersUseCase
);

router.get('/teachers', authMiddleware, chatController.getTeachersForStudent);
router.get('/conversations', authMiddleware, chatController.getConversations);
router.get('/history/:otherUserId', authMiddleware, chatController.getChatHistory);
router.post('/send', authMiddleware, chatController.sendMessage);
router.put('/read', authMiddleware, chatController.markAsRead);
router.put('/edit', authMiddleware, chatController.editMessage);
router.put('/delete', authMiddleware, (chatController as any).deleteMessage);
router.get('/search', authMiddleware, (chatController as any).searchUsers);
router.post('/upload', authMiddleware, upload.single('file'), chatController.uploadFile);
router.post('/group/create', authMiddleware, chatController.createClassGroup);

export default router;
