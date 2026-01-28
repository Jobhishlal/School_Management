import express from "express";
import { ChatController } from "../http/controllers/Chat/ChatController";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { ChatRepositoryMongo } from "../../infrastructure/repositories/Chat/ChatRepositoryMongo";
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { MongoStudentRepo } from "../../infrastructure/repositories/MongoStudentRepo";
import { SendMessageUseCase } from "../../applications/useCases/Chat/SendMessageUseCase";
import { GetConversationsUseCase } from "../../applications/useCases/Chat/GetConversationsUseCase";
import { GetMessagesUseCase } from "../../applications/useCases/Chat/GetMessagesUseCase";
import { MarkMessagesReadUseCase } from "../../applications/useCases/Chat/MarkMessagesReadUseCase";
import { CreateClassGroupChatUseCase } from "../../applications/useCases/Chat/CreateClassGroupChatUseCase";
import { EditMessageUseCase } from "../../applications/useCases/Chat/EditMessageUseCase";
import { DeleteMessageUseCase } from "../../applications/useCases/Chat/DeleteMessageUseCase";

const router = express.Router();

const chatRepo = new ChatRepositoryMongo();
const teacherRepo = new MongoTeacher();
const studentRepo = new MongoStudentRepo();

const sendMessageUseCase = new SendMessageUseCase(chatRepo);
const getConversationsUseCase = new GetConversationsUseCase(chatRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo);
const markMessagesReadUseCase = new MarkMessagesReadUseCase(chatRepo);
const createClassGroupChatUseCase = new CreateClassGroupChatUseCase(chatRepo);
const editMessageUseCase = new EditMessageUseCase(chatRepo);
const deleteMessageUseCase = new DeleteMessageUseCase(chatRepo);

const chatController = new ChatController(
    sendMessageUseCase,
    getConversationsUseCase,
    getMessagesUseCase,
    markMessagesReadUseCase,
    teacherRepo,
    createClassGroupChatUseCase,
    chatRepo,
    editMessageUseCase,
    deleteMessageUseCase,
    studentRepo
);

router.get('/teachers', authMiddleware, chatController.getTeachersForStudent);
router.get('/conversations', authMiddleware, chatController.getConversations);
router.get('/history/:otherUserId', authMiddleware, chatController.getChatHistory);
router.post('/send', authMiddleware, chatController.sendMessage);
router.put('/read', authMiddleware, chatController.markAsRead);
router.put('/edit', authMiddleware, chatController.editMessage);
router.put('/delete', authMiddleware, (chatController as any).deleteMessage);
router.get('/search', authMiddleware, (chatController as any).searchUsers);

import { upload } from "../../infrastructure/middleware/fileUploadService";

router.post('/upload', authMiddleware, upload.single('file'), chatController.uploadFile);
router.post('/group/create', authMiddleware, chatController.createClassGroup);

export default router;
