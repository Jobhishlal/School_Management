import express from "express";
import { ChatController } from "../http/controllers/Chat/ChatController";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { ChatRepositoryMongo } from "../../infrastructure/repositories/Chat/ChatRepositoryMongo";
import { MongoTeacher } from "../../infrastructure/repositories/MongoTeacherRepo";
import { SendMessageUseCase } from "../../applications/useCases/Chat/SendMessageUseCase";
import { GetConversationsUseCase } from "../../applications/useCases/Chat/GetConversationsUseCase";
import { GetMessagesUseCase } from "../../applications/useCases/Chat/GetMessagesUseCase";
import { MarkMessagesReadUseCase } from "../../applications/useCases/Chat/MarkMessagesReadUseCase";
import { CreateClassGroupChatUseCase } from "../../applications/useCases/Chat/CreateClassGroupChatUseCase";

const router = express.Router();

const chatRepo = new ChatRepositoryMongo();
const teacherRepo = new MongoTeacher();

const sendMessageUseCase = new SendMessageUseCase(chatRepo);
const getConversationsUseCase = new GetConversationsUseCase(chatRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo);
const markMessagesReadUseCase = new MarkMessagesReadUseCase(chatRepo);
const createClassGroupChatUseCase = new CreateClassGroupChatUseCase(chatRepo);

const chatController = new ChatController(
    sendMessageUseCase,
    getConversationsUseCase,
    getMessagesUseCase,
    markMessagesReadUseCase,
    teacherRepo,
    createClassGroupChatUseCase,
    chatRepo
);

// Prefix: /api/chat

router.get('/teachers', authMiddleware, chatController.getTeachersForStudent);
router.get('/conversations', authMiddleware, chatController.getConversations);
router.get('/history/:otherUserId', authMiddleware, chatController.getChatHistory);
router.post('/send', authMiddleware, chatController.sendMessage);
router.put('/read', authMiddleware, chatController.markAsRead);

import { upload } from "../../infrastructure/middleware/fileUploadService";

router.post('/upload', authMiddleware, upload.single('file'), chatController.uploadFile);
router.post('/group/create', authMiddleware, chatController.createClassGroup);

export default router;
